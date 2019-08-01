import json
import subprocess
import argparse

import os

if not os.path.isfile(os.path.expandvars("$TREC_EVAL_HOME/trec_eval")):
    print("""Please install trec eval and set $TREC_EVAL_HOME env var.\n
        
        To install trec_eval :

        git clone https://github.com/usnistgov/trec_eval.git
        cd trec_eval
        make
        export TREC_EVAL_HOME=$(pwd)
        
        or something close to this
        """)

parser = argparse.ArgumentParser()

parser.add_argument("-i", "--input_file")
parser.add_argument("-log", "--log")
parser.add_argument("-score", "--score")
parser.add_argument("-q", "--qrels")

args = parser.parse_args()

    
command = [os.path.expandvars("$TREC_EVAL_HOME/trec_eval"), "-c", "-M1001", "-m", "map", args.qrels, args.input_file]
completed_process = subprocess.run(command, capture_output=True)
results = completed_process.stdout.decode("utf-8").strip().split("\t")[-1]
print(results)
with open(args.score, "w") as f:
    json.dump({"map": results,"score": results}, f)
