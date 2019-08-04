import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import StatTracker from 'parser/shared/modules/StatTracker';

import SPELLS from 'common/SPELLS';
import { calculateAzeriteEffects } from 'common/stats';
import { formatPercentage } from 'common/format';

import AzeritePowerStatistic from 'interface/statistics/AzeritePowerStatistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import IntellectIcon from 'interface/icons/Intellect';

const wrackingBrillianceStats = traits => traits.reduce((total, rank) => {
  const [ intellect ] = calculateAzeriteEffects(SPELLS.WRACKING_BRILLIANCE.id, rank);
  return total + intellect;
}, 0);

const debug = false;

/*
  Wracking Brilliance:
  Every other Soul Shard your Agony generates also increases your Intellect by X for 6 sec.
 */
class WrackingBrilliance extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  intellect = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.WRACKING_BRILLIANCE.id);
    if (!this.active) {
      return;
    }

    this.intellect = wrackingBrillianceStats(this.selectedCombatant.traitsBySpellId[SPELLS.WRACKING_BRILLIANCE.id]);
    debug && this.log(`Total bonus from WB: ${this.intellect}`);

    this.statTracker.add(SPELLS.WRACKING_BRILLIANCE_BUFF.id, {
      intellect: this.intellect,
    });
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.WRACKING_BRILLIANCE_BUFF.id) / this.owner.fightDuration;
  }

  get averageIntellect() {
    return (this.uptime * this.intellect).toFixed(0);
  }

  statistic() {
    return (
      <AzeritePowerStatistic
        size="small"
        tooltip={`Wracking Brilliance grants ${this.intellect} Intellect while active. You had ${formatPercentage(this.uptime)} % uptime on the buff.`}
      >
        <BoringSpellValueText spell={SPELLS.WRACKING_BRILLIANCE}>
          <IntellectIcon /> {this.averageIntellect} <small>average Intellect</small>
        </BoringSpellValueText>
      </AzeritePowerStatistic>
    );
  }
}

export default WrackingBrilliance;
