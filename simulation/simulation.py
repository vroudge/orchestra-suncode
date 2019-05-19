import urllib3
import json
from ders import DER


class Simulation():
    def __init__(self):
        self.list_ders = []
        num_ders = 10
        for i in range(num_ders):
            self.list_ders.append(DER(i))
        self.total = 0
        self.total_list = [100]*20

    def return_total_dict(self):
        output_dict = {}
        for i, output in enumerate(
                self.total_list[len(self.total_list)-20:]):
            output_dict[str(i)] = {"x": output, "y": output}
        return output_dict

    def run_simulation(self):
        power = [10] * 30
        power[10] = 10/9 + 10
        available = [True] * 30
        available[10] = False
        for t in range(30):
            total_list = 0
            self.list_ders[0].step(available[t], power[t])
            total_list += self.list_ders[0].current_output
            for der in self.list_ders[1:]:
                der.step(True, power[t])
                total_list += der.current_output
            self.total_list.append(total_list)
            self.send_to_visu()

    def send_to_visu(self):
        data_dict = {}
        for der in self.list_ders:
            data_dict[str(der.id)] = der.return_output_dict()
        data_dict['total'] = self.return_total_dict()
        print(data_dict)
        data_json = json.dumps(data_dict)

        http = urllib3.PoolManager()

        r = http.request('POST', 'http://ec2-54-245-75-78.us-west-2.compute.amazonaws.com:8088/plot',
                         headers={'Content-Type': 'application/json'},
                         body=data_json)


if __name__ == "__main__":
    simu = Simulation()
    simu.run_simulation()
