import requests
import json
import pandas as pd

payload = {
    'venue_ids': r'{}', 
    'org_ids': r'{}', 
    'start_date': '1900-01-01T04:00:00.000Z', 
    'end_date': 'infinity', 
    'search_text': '0', 
    'composer_id': '0',
    'piece_id': '0'
}

headers = {
    'Range': '0-15000'
}

r = requests.get('https://www.classicalconcertmap.com/api/rpc/f_get_concerts', params=payload, headers=headers)

data = r.json()

df = pd.DataFrame(data)
print(df.shape)
df.to_csv('outputall.csv',index=False)
#concert_id, title, date_time, venue_name, venue_address, venue_lat, venue_lon, venue_timezone, concert_details
#org_name, composers_and_pieces, url