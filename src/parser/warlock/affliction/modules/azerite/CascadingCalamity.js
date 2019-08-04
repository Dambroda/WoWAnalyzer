import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import StatTracker from 'parser/shared/modules/StatTracker';

import SPELLS from 'common/SPELLS';
import { calculateAzeriteEffects } from 'common/stats';
import { formatPercentage } from 'common/format';

import HasteIcon from 'interface/icons/Haste';
import AzeritePowerStatistic from 'interface/statistics/AzeritePowerStatistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';

const cascadingCalamityStats = traits => traits.reduce((total, rank) => {
  const [ haste ] = calculateAzeriteEffects(SPELLS.CASCADING_CALAMITY.id, rank);
  return total + haste;
}, 0);

/*
  Cascading Calamity:
  Casting Unstable Affliction on a target affected by your Unstable Affliction increases your Haste by X for 15 sec
 */
class CascadingCalamity extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  haste = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.CASCADING_CALAMITY.id);
    if (!this.active) {
      return;
    }

    this.haste = cascadingCalamityStats(this.selectedCombatant.traitsBySpellId[SPELLS.CASCADING_CALAMITY.id]);

    this.statTracker.add(SPELLS.CASCADING_CALAMITY_BUFF.id, {
      haste: this.haste,
    });
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.CASCADING_CALAMITY_BUFF.id) / this.owner.fightDuration;
  }

  get averageHaste() {
    return (this.uptime * this.haste).toFixed(0);
  }

  statistic() {
    return (
      <AzeritePowerStatistic
        size="small"
        tooltip={`Cascading Calamity grants ${this.haste} Haste while active. You had ${formatPercentage(this.uptime)} % uptime on the buff.`}
      >
        <BoringSpellValueText spell={SPELLS.CASCADING_CALAMITY}>
          <HasteIcon /> {this.averageHaste} <small>average Haste</small>
        </BoringSpellValueText>
      </AzeritePowerStatistic>
    );
  }
}

export default CascadingCalamity;
