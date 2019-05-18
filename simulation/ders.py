

class DER():
    def __init__(self, id, available, max_output, max_output_duration, state, current_output):
        self.id = id
        self.available = available
        self.max_output = max_output
        self.max_output_duration = max_output_duration
        self.current_state = state
        self.current_output = current_output
        self.timer = 0
        self.timeout = None

    def command(self, state, magnitude, duration):
        self.current_state = state
        self.current_output = magnitude
        self.timeout = duration

    def step(self, state, magnitude, duration):
        if self.available:
            self.command(state, magnitude, duration)
        else:
            if self.timeout:
                self.timer += 1
                print(self.timer)
                if self.timer > self.timeout:
                    self.current_state = 0
                    self.timeout = None

                else:
                    self.step(None, None, None)

    def send(self):
        import json
        import urllib3

        if not(self.available):
            self.step(None,None,None)
            return {
                "id": self.id,
                "available": self.available,
                "max_output": self.max_output,
                "max_output_duration": self.max_output_duration,
                "current_command": {
                    "magnitude": self.current_output,
                    "command_timeout": self.timeout
                }
            }
        else:
            encoded_body = json.dumps(
                {
                    "id": self.id,
                    "available": self.available,
                    "max_output": self.max_output,
                    "max_output_duration": self.max_output_duration,
                    "current_command": {
                        "magnitude": self.current_output,
                        "command_timeout": self.timeout
                    }
                }
            )

            http = urllib3.PoolManager()

            r = http.request('POST', 'http://ec2-54-245-75-78.us-west-2.compute.amazonaws.com:8088/heartbeat',
                             headers={'Content-Type': 'application/json'},
                             body=encoded_body)
            response = json.loads(r.data)
            print(response)

            self.step(response['energized'],
                      response['magnitude'], response['duration'])
            return {
                "id": self.id,
                "available": self.available,
                "max_output": self.max_output,
                "max_output_duration": self.max_output_duration,
                "current_command": {
                    "magnitude": self.current_output,
                    "command_timeout": self.timeout
                }
            }


class Storage(DER):
    def __init__(self, id, available, max_output, max_output_duration, state, current_output,
                 min_capacity, max_capacity):

        super().__init__(id, available, max_output,
                         max_output_duration, state, current_output)
        self.min_capacity = min_capacity
        self.max_capacity = max_capacity


class PVS(DER):
    def __init__(self, id, available, max_output, max_output_duration, state, current_output):
        super().__init__(id, available, max_output, max_output_duration, 1,
                         current_output)


class OnOff(DER):
    def __init__(self, id, available, max_output, max_output_duration, state, current_output):
        super().__init__(id, available, max_output, max_output_duration, state,
                         current_output)


class EVS(Storage):
    def __init__(self, id, available, max_output, max_output_duration, state,
                 current_output, presence_probability):
        super().__init__(id, available, max_output,
                         max_output_duration, state, current_output)
        self.presence_probability = presence_probability


def main():
    battery = Storage('1', True, 10, 10, 1, 0, 100, 100)

    c = battery.send()
    print(c)
    battery.available = False
    c = battery.send()
    print(c)


if __name__ == "__main__":
    main()
