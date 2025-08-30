from collections import defaultdict

power_levels = {
    1: "Слабый",
    2: "Средний",
    3: "Сильный"
}

from hero_data import *

hero_library = init_heroes()

def create_counterpick_dict(enemy_team: list[str]):
    counter_tank = hero_library[enemy_team[0]].counters[Role.TANK][0]

    tank_counters_power = defaultdict(int)
    dps_counters_power = defaultdict(int)
    sup_counters_power = defaultdict(int)

    counters_library = []

    for enemy_hero_name in enemy_team:
        current_hero = hero_library[enemy_hero_name]

        tank_counters = current_hero.counters[Role.TANK]
        for tank_counter in tank_counters:
            counters_library.append((enemy_hero_name, tank_counter.name, tank_counter.power, tank_counter.reason))
            tank_counters_power[tank_counter.name] += tank_counter.power

        dps_counters = current_hero.counters[Role.DAMAGE]
        for dps_counter in dps_counters:
            counters_library.append((enemy_hero_name, dps_counter.name, dps_counter.power, dps_counter.reason))
            dps_counters_power[dps_counter.name] += dps_counter.power

        sup_counters = current_hero.counters[Role.SUPPORT]
        for sup_counter in sup_counters:
            counters_library.append((enemy_hero_name, sup_counter.name, sup_counter.power, sup_counter.reason))
            sup_counters_power[sup_counter.name] += sup_counter.power

    dps_counters_power = sorted(dps_counters_power.items(), key=lambda x: x[1], reverse=True)[:2]
    sup_counters_power = sorted(sup_counters_power.items(), key=lambda x: x[1], reverse=True)[:2]

    our_team_names = [counter_tank.name, dps_counters_power[0][0], dps_counters_power[1][0], sup_counters_power[0][0], sup_counters_power[1][0]]

    result_dict = defaultdict(list)
    for hero_name in our_team_names:
        for tpl in counters_library:
            if tpl[1] == hero_name:
                result_dict[hero_name].append(f'({tpl[0]}, {power_levels[tpl[2]]}) — {tpl[3]}')

    return result_dict

