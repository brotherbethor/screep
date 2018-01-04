X = 0
Y = 1

UP =1
DOWN = -1


a = []
for i in range(0,30):
    b = []
    for j in range(0,30):
        b.append('.')
    a.append(b)


def paint(coords):
    a[coords[X]][coords[Y]] = 'X'


def walk(axis, direction, radius):
    for step in range(0,2*radius):
        pos[axis] += direction
        paint(pos)


def walk_around_center(center, radius):
    pos = [None, None]
    pos[X], pos[Y] = center[X], center[Y]
    pos[0] += radius
    pos[1] += radius
    for direction in (DOWN, UP):
        for axis in (X,Y):
            for step in range(0,2*radius):
                pos[axis] += direction
                # remember, this is only because of the array constructin!!!
                if ((pos[X] - center[X]) % 2) == 0:
                    paint(pos)


def _walk_around_center(center, radius):
    pos = center
    pos[0] += radius
    pos[1] += radius

    for step in range(0,2*radius):
        pos[0] += -1
        paint(pos)
    for step in range(0,2*radius):
        pos[1] += -1
        paint(pos)
    for step in range(0,2*radius):
        pos[0] += 1
        paint(pos)
    for step in range(0,2*radius):
        pos[1] += 1
        paint(pos)

walk_around_center([15,15], 2)

for i in a:
    print ''.join(i)

