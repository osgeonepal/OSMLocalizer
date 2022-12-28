import pandas as pd
import psycopg2
from backend.config import EnvironmentConfig
import os

conn = psycopg2.connect(
    f"dbname={EnvironmentConfig.POSTGRES_DB} "
    + f"user={EnvironmentConfig.POSTGRES_USER} "
    + f"host={EnvironmentConfig.POSTGRES_ENDPOINT} "
    + f"port={EnvironmentConfig.POSTGRES_PORT} "
    + f"password={EnvironmentConfig.POSTGRES_PASSWORD}"
)



cur = conn.cursor()


text_df = pd.read_csv(os.path.abspath("data_prep/name_df.csv"))


def insertIntoTable(table, data):
    """
    Using cursor.executemany() to insert the dataframe
    """
    # Create a list of tupples from the dataframe values
    data = data[["text","count","status","corrected","google_translate","text_ne"]]
    tuples = list(set([tuple(x) for x in data.to_numpy()]))

    # Comma-separated dataframe columns
    cols = ",".join(list(data.columns))
    print(cols)
    # SQL query to execute
    query = (
        "INSERT INTO %s(%s) VALUES(%%s,%%s,%%s,%%s,%%s,%%s)"
        % (table, cols)
    )
    try:
        cur.executemany(query, tuples)
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print("Error: %s" % error)
        conn.rollback()
        return 1

insertIntoTable("translate", text_df)