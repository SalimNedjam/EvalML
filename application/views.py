import json
from subprocess import Popen, PIPE, STDOUT

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def file_maniputer(request):
    print(request)
    if request.method == 'POST':
        data = create_directory()
        response = HttpResponse(json.dumps(data), content_type='application/json', status=200)
        return response


def create_directory():
    command = ["bash", "Scripts/script.sh", "create"]
    try:
        process = Popen(command, stdout=PIPE, stderr=STDOUT)
        output = process.stdout.read()
        exitstatus = process.poll()
        if (exitstatus == 0):
            return {"status": "Success", "output": str(output)}
        else:
            return {"status": "Failed", "output": str(output)}
    except Exception as e:
        return {"status": "failed", "output": str(e)}


def delete_directory():
    command = ["bash", "Scripts/script.sh", "delete"]
    try:
        process = Popen(command, stdout=PIPE, stderr=STDOUT)
        output = process.stdout.read()
        exitstatus = process.poll()
        if (exitstatus == 0):
            return {"status": "Success", "output": str(output)}
        else:
            return {"status": "Failed", "output": str(output)}
    except Exception as e:
        return {"status": "failed", "output": str(e)}
