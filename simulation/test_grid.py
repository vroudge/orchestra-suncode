# make the code as Python 3 compatible as possible
from __future__ import print_function, division
import pypsa

network = pypsa.Network()

# add three buses
n_buses = 3

for i in range(n_buses):
    network.add("Bus", "bus {}".format(i),
                v_nom=20.)

print(network.buses)

# add three lines in a ring
for i in range(n_buses):
    network.add("Line", "line {}".format(i),
                bus0="bus {}".format(i),
                bus1="bus {}".format((i+1) % n_buses),
                x=0.1,
                r=0.01)

    # add a generator at bus 0
network.add("Generator", "gen %d" % (0),
            bus="bus 0",
            p_set=100,
            control="PQ")

# add a load at bus 1
network.add("Load", "load %d" % (0),
            bus="bus 1",
            p_set=100)

network.loads.q_set = 100.

network.pf()

print(network.lines_t.p0)
print(network.buses_t.p)
