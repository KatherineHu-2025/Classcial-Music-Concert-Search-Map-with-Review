import pandas as pd
import mysql.connector
from datetime import datetime
import pytz
from timezonefinder import TimezoneFinder


def insertPiece(cursor,composer, title):
    try:
        query = """INSERT INTO Piece (composer,title)
                   VALUES (%s, %s)"""
        values = (
            composer if pd.notna(composer) else None,
            title if pd.notna(title) else None
        )
        cursor.execute(query, values)
        return True
    
    except mysql.connector.Error as error_descriptor:
        print(f"Failed inserting piece: {error_descriptor}")
        return False

def insertVenue(cursor,venue_id,name,address,lattitude,longtitude,time_zone):
    try:
        query = """INSERT INTO Venue (venue_id,name,address,lattitude,longtitude,time_zone)
                   VALUES (%s, %s, %s, %s, %s, %s)
                   ON DUPLICATE KEY UPDATE name=%s, address=%s,lattitude=%s,longtitude=%s,time_zone=%s"""
        values = (
            venue_id,
            name if pd.notna(name) else None,
            address if pd.notna(address) else None,
            lattitude if pd.notna(lattitude) else None,
            longtitude if pd.notna(longtitude) else None,
            time_zone if pd.notna(longtitude) else None,
            name if pd.notna(name) else None,
            address if pd.notna(address) else None,
            lattitude if pd.notna(lattitude) else None,
            longtitude if pd.notna(longtitude) else None,
            time_zone if pd.notna(longtitude) else None
        )
        cursor.execute(query, values)
    except mysql.connector.Error as error_descriptor:
        print(f"Failed inserting venue: {error_descriptor}")

#Given that in the original data, concerts with different time have different id,
#this concert id needs to be auto incremented. 
def insertConcert(cursor,title, org, details, url):
    try:
        query = """INSERT INTO Concert (title, org, details, url)
                   VALUES (%s, %s, %s, %s)"""
        values = (
            title if pd.notna(title) else None,
            org if pd.notna(org) else None,
            details if pd.notna(details) else None,
            url if pd.notna(url) else None
        )
        cursor.execute(query, values)
        return True
        
    except mysql.connector.Error as error_descriptor:
        print(f"Failed inserting concert: {error_descriptor}")
        return False

def insertComment(cursor,content,rate):
    try:
        query = """INSERT INTO Comment (content, rate)
                   VALUES (%s, %s)"""
        values = (
            content,
            rate
        )
        cursor.execute(query, values)
    except mysql.connector.Error as error_descriptor:
        print(f"Failed inserting comment: {error_descriptor}")

def insertPerformance(cursor,perform_id,concert_id, venue_id,date_time,pretty_datetime):
    try:
        query = """INSERT INTO Performance (perform_id,concert_id, venue_id,date_time, pretty_datetime)
                   VALUES (%s, %s, %s, %s, %s)"""
        values = (
            perform_id if pd.notna(perform_id) else None,
            concert_id if pd.notna(concert_id) else None,
            venue_id if pd.notna(venue_id) else None,
            date_time if pd.notna(date_time) else None,
            pretty_datetime if pd.notna(pretty_datetime) else None
        )
        cursor.execute(query, values)
    
    except mysql.connector.Error as error_descriptor:
        print(f"Failed inserting performance: {error_descriptor}")

def insertPerformance_piece(cursor,concert_id, piece_id):
    try:
        query = """INSERT INTO Performance_piece (concert_id, piece_id)
                   VALUES (%s, %s)"""
        values = (
            concert_id,
            piece_id
        )
        cursor.execute(query, values)
    except mysql.connector.Error as error_descriptor:
        print(f"Failed inserting performance_piece: {error_descriptor}")
        
def insertPerformance_post(cursor,perform_id, comment_id):
    try:
        query = """INSERT INTO Performance_post (perform_id, comment_id)
                   VALUES (%s, %s)"""
        values = (
            perform_id, 
            comment_id
        )
        cursor.execute(query, values)
    except mysql.connector.Error as error_descriptor:
        print(f"Failed inserting comment: {error_descriptor}")

def convert_to_local_time(iso_timestamp, timezone_str):
    # Parse the ISO timestamp
    utc_time = datetime.fromisoformat(iso_timestamp)

    # Convert to the specified time zone
    local_timezone = pytz.timezone(timezone_str)
    local_time = utc_time.astimezone(local_timezone)

    # Format the time in 'YYYY-MM-DD HH:MM:SS'
    formatted_local_time = local_time.strftime('%Y-%m-%d %H:%M:%S')
    pretty_date_time = local_time.strftime('%A,%B %d, %Y %I:%M %p')
    return formatted_local_time,pretty_date_time

def main():
    # Main program
    # Connect to MySQL
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='12345678',
        database='Classical',
    )

    # Create a cursor for data manipulation
    cursor = connection.cursor()

    # Initialize sets to keep track of unique players and tournaments
    piece_composer_set = set()
    venue = set()
    concert = set()
    concert_dic = {}
    performance = set()
    last_row_valid = False
    
    data = pd.read_csv('outputall.csv')
    
    
    for index,row in data.iterrows():
        # Insert the venues to the table and avoid duplicates
        if (row['venue_id'] not in venue):
            insertVenue(cursor,row['venue_id'],row['venue_name'],row['venue_address'],row['venue_lat'],row['venue_lon'],row['venue_timezone'])
            # Add to set if not NULL
            if(pd.notna(row['venue_id'])):
                venue.add(row['venue_id'])
        
        # Insert the concert to the table and avoid duplicates, it has to succeed to avoid errors in lastrowid
        if (row['title'] not in concert):
            if (insertConcert(cursor,row['title'],row['org_name'],row['concert_details'],row['url'])):
                name = row['title']
                concert_id = cursor.lastrowid
                
                last_row_valid = True
                if(pd.notna(row['title'])):
                    concert.add(row['title'])
                    # A concert dictionary for finding the concert_id
                    concert_dic[row['title']] = concert_id
        
        if (row['concert_id'] not in performance):
            if(last_row_valid):
                datetime, pretty_datetime = convert_to_local_time(row['date_time'],row['venue_timezone'])
                insertPerformance(cursor,row['concert_id'],concert_id,row['venue_id'],datetime,pretty_datetime)
                performance.add(row['concert_id'])
                last_row_valid = False
            #There are cases when concert has been added to set so that last_row_valid is False
            else:
                if (row['title'] in concert):
                    datetime, pretty_datetime = convert_to_local_time(row['date_time'],row['venue_timezone'])
                    concert_id = concert_dic[row['title']]
                    insertPerformance(cursor,row['concert_id'],concert_id,row['venue_id'],datetime,pretty_datetime)
                    performance.add(row['concert_id'])

            
        # Insert the pieces to the table and avoid duplicates
        if (pd.notna(row['composers_and_pieces'])):
            list = eval(row['composers_and_pieces'])
            for element in list:
                composer = element['Composer']
                piece = element['Piece']
                if(piece not in piece_composer_set):
                    if(insertPiece(cursor,composer,piece)):
                        piece_id = cursor.lastrowid
                        last_row_valid = True
                    piece_composer_set.add(piece)
                    if(last_row_valid):
                        insertPerformance_piece(cursor,concert_id,piece_id)
                        last_row_valid = False

        


    # Commit changes and close connection
    connection.commit()
    cursor.close()
    connection.close()


if __name__ == '__main__':
    main()
