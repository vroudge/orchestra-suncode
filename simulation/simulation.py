import pypsa
import pandas as pd
import numpy as np
import logging
import urllib.request
import time
import argparse
import json
import os


logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s.%(msecs)03d %(levelname)s:%(name)s:%(message)s',
    datefmt='%Y-%m-%dT%H:%M:%SZ')

logging.Formatter.converter = time.gmtime


def create_and_save_network(network_path):
    network = pypsa.Network()
    num_bus = 3
    num_lines = 3

    for i in range(num_bus):
        network.add("Bus", "bus_{}".format(i))

    for i in range(num_lines):
        network.add("Line",
                    "line_{}".format(i),
                    bus0="bus_{}".format(i),
                    bus1="bus_{}".format((i + 1) % 3),
                    x=0.0001,
                    s_nom=60)

    network.add("Generator", "gen_0",
                bus="bus_0",
                p_nom=100,
                marginal_cost=50)

    network.add("Generator", "gen_1",
                bus="bus_1",
                p_nom=100,
                marginal_cost=25)

    network.add("Load", "load",
                bus="bus_2",
                p_set=60)

    network.export_to_csv_folder(network_path)


class Grid():
    def __init__(self, network_path="./network"):
        self.network_path = network_path
        if not os.path.isfile(self.network_path):
            create_and_save_network(self.network_path)
        self.network = self._load_network()

    def _load_network(self):
        network = pypsa.Network()
        network.import_from_csv_folder(self.network_path)
        return network

    def update_network(self, new_loads):
        # network.generators.at["Gas 0", "p_nom"] = 350

    def run(self):
        self.network.pf()

    def plot(self):
        pass


class Simulation():
    def __init__(self):
        # should have a list of the ders connected with ids
        self.grid = Grid()

    def get_stats(self):
        # TBD
        pass

    def send_data(self, data):
        url = 'http://127.0.0.1:8888/stats'
        headers = {'content-type': 'application/json'}
        req = urllib.request.Request(url,
                                     'query {node {id}}', headers)
        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read())
                self.grid.update_network(
                    data.get('loads'))
        except:
            pass

    def run_simulation(self):
        data = self.grid.run()
        self.send_data(data)
