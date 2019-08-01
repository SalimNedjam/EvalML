#!/usr/bin/python
import sys, getopt, errno,random
import argparse
def main(args):
    
    args = parser.parse_args()
    print(args.o)

    file = open(args.o,'w')
    file.write('Hello World')
    file.write('Why? Because we can.')
    file.close()
    score=random.randint(1,101)
    sys.exit(score)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", type=str, required=True)
    parser.add_argument("-o", type=str, required=True)
    parser.add_argument("-log", type=str, required=True)
    args = parser.parse_args()
    main(args)

