#!/usr/bin/python

def fill_row(row, fields, start, count, center):
    i = 0
    x, y = row, start[1]
    while i < count:
        field = (x, y)
        if (not field in fields):
            fields.append(field)
        y += 2 # always leave one field in between empty
        i += 1
    return fields;


def do_cube(center, fields, length):
    start = (center[0] - (length - 1), center[1] - (length - 1))
    l = 0
    row = start[1]
    while l < length:
        fill_row(row, fields, start, length, center)
        l += 1
        row +=2
    return fields

start = 0
w = 0
width = 9
fields = do_cube((0, 0), [], width)

while w < width:
    print fields[start:start+width]
    w+=1
    start += width
