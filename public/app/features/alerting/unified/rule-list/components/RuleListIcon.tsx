import { ComponentProps, memo } from 'react';
import type { RequireAtLeastOne } from 'type-fest';

import { Icon, type IconName, Text, Tooltip } from '@grafana/ui';
import type { RuleHealth } from 'app/types/unified-alerting';
import { PromAlertingRuleState } from 'app/types/unified-alerting-dto';

import { isErrorHealth } from '../../components/rule-viewer/RuleViewer';

type TextProps = ComponentProps<typeof Text>;

interface RuleListIconProps {
  recording?: boolean;
  state?: PromAlertingRuleState;
  health?: RuleHealth;
  isPaused?: boolean;
}

const icons: Record<PromAlertingRuleState, IconName> = {
  [PromAlertingRuleState.Inactive]: 'check-circle',
  [PromAlertingRuleState.Pending]: 'circle',
  [PromAlertingRuleState.Firing]: 'exclamation-circle',
};

const color: Record<PromAlertingRuleState, 'success' | 'error' | 'warning'> = {
  [PromAlertingRuleState.Inactive]: 'success',
  [PromAlertingRuleState.Pending]: 'warning',
  [PromAlertingRuleState.Firing]: 'error',
};

const stateNames: Record<PromAlertingRuleState, string> = {
  [PromAlertingRuleState.Inactive]: 'Normal',
  [PromAlertingRuleState.Pending]: 'Pending',
  [PromAlertingRuleState.Firing]: 'Firing',
};

/**
 * Make sure that the order of importance here matches the one we use in the StateBadge component for the detail view
 * This component is often rendered tens or hundreds of times in a single page, so it's performance is important
 */
export const RuleListIcon = memo(function RuleListIcon({
  state,
  health,
  recording = false,
  isPaused = false,
}: RequireAtLeastOne<RuleListIconProps>) {
  let iconName: IconName = state ? icons[state] : 'circle';
  let iconColor: TextProps['color'] = state ? color[state] : 'secondary';
  let stateName: string = state ? stateNames[state] : 'unknown';

  if (recording) {
    iconName = 'record-audio';
    iconColor = 'success';
    stateName = 'Recording';
  }

  if (health === 'nodata') {
    iconName = 'exclamation-triangle';
    iconColor = 'warning';
    stateName = 'Insufficient data';
  }

  if (isErrorHealth(health)) {
    iconName = 'times-circle';
    iconColor = 'error';
    stateName = 'Failed to evaluate rule';
  }

  if (isPaused) {
    iconName = 'pause-circle';
    iconColor = 'warning';
    stateName = 'Paused';
  }

  return (
    <Tooltip content={stateName} placement="right">
      <div>
        <Text color={iconColor}>
          <Icon name={iconName} size="lg" />
        </Text>
      </div>
    </Tooltip>
  );
});
