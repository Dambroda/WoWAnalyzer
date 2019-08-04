import React from 'react';
import Events from 'parser/core/Events';
import Analyzer, { SELECTED_PLAYER_PET, SELECTED_PLAYER } from 'parser/core/Analyzer';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import {calculateAzeriteEffects} from 'common/stats';
import SPELLS from 'common/SPELLS';

import { formatNumber, formatPercentage } from 'common/format';
import StatTracker from 'parser/shared/modules/StatTracker';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import AzeritePowerStatistic from 'interface/statistics/AzeritePowerStatistic';
import HasteIcon from 'interface/icons/Haste';

const furyOfXuenStats = traits => Object.values(traits).reduce((obj, rank) => {
  const [haste] = calculateAzeriteEffects(SPELLS.FURY_OF_XUEN.id, rank);
  obj.haste += haste;
  return obj;
}, {
  haste: 0,
});

/**
 * Your Combo Strikes grant a stacking 2% chance for your next Fists of Fury to grant 768 Haste and invoke Xuen, The White Tiger for 8 sec.
 *
 * The tooltip is rounded up and it actually gives 1.5% per stack
 */
class FuryOfXuen extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    statTracker: StatTracker,
  };

  damageDone = 0;
  furyXuens = [];

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.FURY_OF_XUEN.id);
    if (!this.active) {
      return;
    }
    const {haste} = furyOfXuenStats(this.selectedCombatant.traitsBySpellId[SPELLS.FURY_OF_XUEN.id]);
    this.haste = haste;

    this.statTracker.add(SPELLS.FURY_OF_XUEN_SUMMON.id, {
      haste,
    });

    this.addEventListener(Events.damage.by(SELECTED_PLAYER_PET), this.onPetDamage);
    this.addEventListener(Events.summon.by(SELECTED_PLAYER).spell(SPELLS.FURY_OF_XUEN_SUMMON), this.onPlayerSummon);
  }

  onPlayerSummon(event) {
    const furyXuen = {targetID: event.targetID, targetInstance: event.targetInstance};
    this.furyXuens.push(furyXuen);
  }

  onPetDamage(event) {
    const xuen = {sourceID: event.sourceID, sourceInstance: event.sourceInstance};
    if (!this._isSummonedByFury(xuen)) {
      return;
    }
    this.damageDone += event.amount + (event.absorbed || 0);
  }

  _isSummonedByFury(xuen) {
    return this.furyXuens.some(furyXuen => furyXuen.targetID === xuen.sourceID && furyXuen.targetInstance === xuen.sourceInstance);
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.FURY_OF_XUEN_SUMMON.id) / this.owner.fightDuration;
  }

  get avgHaste() {
    return this.uptime * this.haste;
  }

  get dps(){
    return this.damageDone / this.owner.fightDuration * 1000;
  }

  statistic() {
    return (
      <AzeritePowerStatistic
        size="flexible"
        tooltip={<>You procced Fury of Xuen <b>{this.furyXuens.length}</b> times and had <b>{this.haste}</b> extra haste for <b>{formatPercentage(this.uptime)}%</b> of the fight</>}
      >
        <BoringSpellValueText spell={SPELLS.FURY_OF_XUEN}>
        <img
          src="/img/sword.png"
          alt="Damage"
          className="icon"
        /> {formatNumber(this.dps)} DPS <small>{formatPercentage(this.owner.getPercentageOfTotalDamageDone(this.damageDone))} % of total</small> 
          <br />
          <HasteIcon /> {formatNumber(this.avgHaste)} <small>average Haste gained</small>
        </BoringSpellValueText>
      </AzeritePowerStatistic>
    );
  }
}



export default FuryOfXuen;
