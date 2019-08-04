import React from 'react';

import BaseChecklist from 'parser/shared/modules/features/Checklist/Module';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import Combatants from 'parser/shared/modules/Combatants';
import PreparationRuleAnalyzer from 'parser/shared/modules/features/Checklist/PreparationRuleAnalyzer';

import BrainFreeze from '../features/BrainFreeze';
import GlacialSpike from '../features/GlacialSpike';
import IceLance from '../features/IceLance';
import ThermalVoid from '../features/ThermalVoid';
import WintersChill from '../features/WintersChill';
import AlwaysBeCasting from '../features/AlwaysBeCasting';
import ArcaneIntellect from '../../../shared/modules/features/ArcaneIntellect';
import CancelledCasts from '../../../shared/modules/features/CancelledCasts';
import RuneOfPower from '../../../shared/modules/features/RuneOfPower';
import WaterElemental from '../features/WaterElemental';

import Component from './Component';

class Checklist extends BaseChecklist {
  static dependencies = {
    combatants: Combatants,
    castEfficiency: CastEfficiency,
    brainFreeze: BrainFreeze,
    glacialSpike: GlacialSpike,
    iceLance: IceLance,
    thermalVoid: ThermalVoid,
    wintersChill: WintersChill,
    arcaneIntellect: ArcaneIntellect,
    cancelledCasts: CancelledCasts,
    runeOfPower: RuneOfPower,
    alwaysBeCasting: AlwaysBeCasting,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,
    waterElemental: WaterElemental,
  };

  render() {
    return (
      <Component
        combatant={this.combatants.selected}
        castEfficiency={this.castEfficiency}
        thresholds={{
          ...this.preparationRuleAnalyzer.thresholds,

          downtimeSuggestionThresholds: this.alwaysBeCasting.downtimeSuggestionThresholds,
          brainFreezeUtilization: this.brainFreeze.utilSuggestionThresholds,
          brainFreezeOverwrites: this.brainFreeze.overwriteSuggestionThresholds,
          brainFreezeExpired: this.brainFreeze.expiredSuggestionThresholds,
          brainFreezeUnbuffedFlurry: this.brainFreeze.flurryWithoutProcSuggestionThresholds,
          glacialSpikeUtilization: this.glacialSpike.utilSuggestionThresholds,
          fingersOfFrostUtilization: this.iceLance.fingersUtilSuggestionThresholds,
          iceLanceNotShattered: this.iceLance.nonShatteredSuggestionThresholds,
          wintersChillIceLance: this.wintersChill.iceLanceUtilSuggestionThresholds,
          wintersChillHardCasts: this.wintersChill.hardcastUtilSuggestionThresholds,
          arcaneIntellectUptime: this.arcaneIntellect.suggestionThresholds,
          cancelledCasts: this.cancelledCasts.suggestionThresholds,
          runeOfPowerBuffUptime: this.runeOfPower.roundedSecondsSuggestionThresholds,
          waterElementalUptime: this.waterElemental.suggestionThresholds,
        }}
      />
    );
  }
}

export default Checklist;
