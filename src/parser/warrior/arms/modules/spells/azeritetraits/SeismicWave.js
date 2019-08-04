import React from 'react';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import { formatNumber } from 'common/format';
import SPELLS from 'common/SPELLS/index';
import TraitStatisticBox, { STATISTIC_ORDER } from 'interface/others/TraitStatisticBox';
import Events from 'parser/core/Events';

/**
 * Overpower causes a seismic wave that deals 124 Physical damage to enemies in a 10 yd line.
 */

class SeismicWave extends Analyzer {

  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.SEISMIC_WAVE.id);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.SEISMIC_WAVE_DAMAGES), this._onSeismicWaveDamage);
  }

  _onSeismicWaveDamage(event) {
    this.damage += (event.amount || 0) + (event.absorbed || 0);
  }

  statistic() {
    return (
      <TraitStatisticBox
        position={STATISTIC_ORDER.OPTIONAL()}
        trait={SPELLS.SEISMIC_WAVE.id}
        value={this.owner.formatItemDamageDone(this.damage)}
        tooltip={`Damage done: ${formatNumber(this.damage)}`}
      />
    );
  }
}

export default SeismicWave;
