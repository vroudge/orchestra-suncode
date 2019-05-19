import json
import urllib3


class DER():
    def __init__(self, id, max_output=1):
        self.id = str(id)
        self.available = True
        self.max_output = max_output
        self.duration = 0
        self.timer = 0
        self.current_output = max_output
        self.list_outputs = [10]*20
        self.command = None
        self.state = {
            "available": self.available,
            "max_output": self.max_output,
            "current_command": self.command,
            "current_output": self.current_output
        }

    def return_output_dict(self):
        output_dict = {}
        for i, output in enumerate(
                self.list_outputs[len(self.list_outputs)-20:]):
            output_dict[str(i)] = {"x": output, "y": output}
        return output_dict

    def apply_command(self, command, power):
        self.duration = command['duration']
        self.current_output = power
        self.state = {
            "available": self.available,
            "max_output": self.max_output,
            "current_command": None,
            "current_output": self.current_output
        }
        self.timer = 0

    def stop_command(self):
        self.timer = 0
        self.duration = 0

    def get_current_output(self):
        return self.current_output

    def step(self, available, power):
        self.available = available
        encoded_body = json.dumps(
            {
                "id": self.id,
                "state": self.state,
            }
        )

        print(encoded_body)

        http = urllib3.PoolManager()

        r = http.request('POST', 'http://ec2-54-245-75-78.us-west-2.compute.amazonaws.com:8088/heartbeat',
                         headers={'Content-Type': 'application/json'},
                         body=encoded_body)
        print(r.data)
        self.command = json.loads(r.data)

        if self.available:
            self.apply_command(self.command, power)
        else:
            if self.timer < self.duration:
                self.timer += 1
            else:
                self.stop_command()

        self.list_outputs.append(self.current_output)
