import patreon, random, asyncio, asyncpg, os, os.path, threading, datetime, time

def getTimestamp():
    todayDate = datetime.date.today()
    if todayDate.day > 25:
        todayDate += datetime.timedelta(7)
    todayDate = todayDate.replace(day=1).replace(month = todayDate.month + 1)
    return time.mktime(datetime.datetime.strptime(str(todayDate), "%Y-%m-%d").timetuple())

def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t

pg_con = None

access_token = 'm1Mb0HeHkgX4wr0KwjzI-O7rfIs9lQjP3SPaeTDCqFI'

api_client = patreon.API(access_token)

campaign_response = api_client.fetch_campaign()
campaign_id = campaign_response.data()[0].id()

async def startup_create_tables(pg_con):
    await pg_con.execute(
        """ 
        CREATE TABLE IF NOT EXISTS existing(
            User_ID bigint PRIMARY KEY,
            Guild_ID bigint NOT NULL,
            Expire_TS bigint NOT NULL,
            Grace_TS bigint NOT NULL
        );
        """
    )

async def check_patreon_database(pg_con):
    all_pledges = []
    cursor = None
    # Get pledges from API
    while True:
        pledges_response = api_client.fetch_page_of_pledges(campaign_id, 25, cursor=cursor)
        cursor = api_client.extract_cursor(pledges_response)
        all_pledges += pledges_response.data()
        if not cursor:
            break

    # Get IDs from pledges
    ids = []
    for pledge in all_pledges:
        p = pledge.relationship('patron')
        try:
            pp = p.attribute('social_connections')
            ppp = pp['discord']
            pppp = ppp['user_id']
            if(pppp != None): 
                ids.append(pppp)
        except:
            pass

    # Insert them into the spreadsheet and Update Existing
    existing = await pg_con.fetch("SELECT * FROM existing;")
    for id in ids:
        id = int(id)
        data = [x for x in existing if x['user_id'] == id]
        await pg_con.execute('INSERT INTO existing (User_ID, Guild_ID, Expire_TS, Grace_TS) VALUES ($1, $2, $3, $4) ON CONFLICT (User_ID) DO NOTHING;',id, 0, getTimestamp(), getTimestamp() + 604800)
        if len(data) != 0:
            entry = data[0]
            if entry['expire_ts'] < getTimestamp():
                await pg_con.execute('UPDATE existing set Expire_TS = $1, Grace_TS = $2 WHERE User_ID = $3', getTimestamp(), getTimestamp() + 604800, id)
    
    # Delete any overdue
    await pg_con.execute('DELETE FROM existing WHERE Grace_TS < $1;' , int(time.time()))
    

async def main():
    pg_con = await asyncpg.create_pool(database = "patreon",user="postgres",password='fuck')
    await startup_create_tables(pg_con)
    while(True):
        await check_patreon_database(pg_con)
        print('Refresh - ' + str(time.time()))
        await asyncio.sleep(60)
    


#Start program here
loop = asyncio.get_event_loop()
loop.run_until_complete(main())