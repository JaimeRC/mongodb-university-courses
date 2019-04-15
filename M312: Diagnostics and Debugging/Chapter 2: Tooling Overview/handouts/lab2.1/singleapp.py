#!/usr/bin/env python
"""
singleapp.py - simplest of generating trouble to a single node

Usage:
    ./singleapp.py [options]

Options:
    -h --help       Show this text.
    --host <host>   Host where the mongod is located [default: localhost]
    --port <port>   Port where the mongod is located [default: 27000]
    -n <procs>      Number of processes. [default: 12]
"""

from docopt import docopt
from pymongo import MongoClient
from multiprocessing import Process
from time import sleep
import random

def checkin(_id, pident, host='localhost', port=27000):
    try:
        client = MongoClient(host=host, port=port)
        client.server_info()
        client.singleapp.checkin.insert_one({
            "_id": _id,
            "process": pident,
            "msg": "was here!"
        })
        sleep(20)
    except:
        # move along citizen, nothing to see here!
        assert True, "expected"

    return True


def main():
    opts = docopt(__doc__)
    host = opts['--host']
    port = int(opts['--port'])
    n_processes = int(opts['-n'])
    ids = range(n_processes)
    rand = random.Random()
    processes = []
    for i in xrange(n_processes-1):
        _id = rand.choice(ids)
        p = Process(target=checkin,
                    kwargs={"host": host,"port": port, "pident": i, "_id": _id})
        p.start()
        processes.append(p)


if __name__ == '__main__':
    main()
