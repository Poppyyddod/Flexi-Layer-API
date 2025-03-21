## We have these feature for the feature :

* Fetch feature (SQL) : 
- Fetch from first row (ASC):
    where: "*"

- Fetch some row (Filter):
    where: {
        "#field_name": "valid data type",
        ...
    }

- Fetch from last row (DESC):
    where: "#primary_key_field_name:LAST"

- sql_supporter (For SQL):
    field_list: #Array_type -> ["field_name", ...]
    limit: #number_type

- nosql_supporter (For NoSQL):
    "update_time_series": true,
    "request_confirmed": true,
    "ignore_supporter": false