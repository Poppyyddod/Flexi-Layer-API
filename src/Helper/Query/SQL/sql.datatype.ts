export const sqlNumberType = [
    'tinyint',
    'smallint',
    'mediumint',
    'int',
    'bigint',
    'integer',
    'float',
    'double',
    'decimal',
    'numeric',
    'real',
];

export const sqlStringType = [
    'character varying',
    'char',
    'varchar',
    'tinytext',
    'text',
    'mediumtext',
    'longtext',
    'tinyblob',
    'blob',
    'mediumblob',
    'longblob',
    'date',
    'datetime',
    'timestamp',
    'timestamp without time zone',
    'time'
];

// export const sqlDateTimeType = [
//     'date',
//     'datetime',
//     'timestamp',
//     'timestamp without time zone',
//     'time',
// ];

export const safeSQLCommands = [
    "CURRENT_TIMESTAMP()",   // ให้วันที่และเวลาปัจจุบัน
    "NOW()",                 // ให้วันที่และเวลาปัจจุบัน
];