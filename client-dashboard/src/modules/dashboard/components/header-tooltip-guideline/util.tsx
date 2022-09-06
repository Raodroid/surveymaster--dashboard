import { ACTIONS, EVENTS, LIFECYCLE, STATUS, Step } from 'react-joyride';
import { Button } from 'antd';
import React from 'react';

export const HOMEPAGE_TARGET_CLASSNAME = {
  step1: 'HOMEPAGE_TARGET_STEP_1',
  step2: 'HOMEPAGE_TARGET_STEP_2',
  step3: 'HOMEPAGE_TARGET_STEP_3',
  step4: 'HOMEPAGE_TARGET_STEP_4',
  step5: 'HOMEPAGE_TARGET_STEP_5',
};

export const MICRO_TARGET_CLASSNAME = {
  step1: 'MICRO_TARGET_STEP_1',
  step2: 'MICRO_TARGET_STEP_2',
  step3: 'MICRO_TARGET_STEP_3',
};

export const MY_SCORE_TARGET_CLASSNAME = {
  step1: 'MY_SCORE_TARGET_STEP_1',
  step2: 'MY_SCORE_TARGET_STEP_2',
  step3: 'MY_SCORE_TARGET_STEP_3',
  step4: 'MY_SCORE_TARGET_STEP_4',
};

export const addDotPrefix = (name: string) => {
  return '.' + name;
};

export const transformStep = (step: Step[]): Step[] => {
  return step.map((item, idx, arr) => ({
    ...item,
    spotlightPadding: 20,
    locale:
      idx === arr.length - 1
        ? {
            last: (
              <div style={{ background: 'white' }}>
                <Button type={'primary'} className="secondary-btn">
                  Complete Tour
                </Button>
              </div>
            ),
          }
        : {
            skip: (
              <Button type={'default'} className={'dark-btn'}>
                Skip Tour
              </Button>
            ),
            next: (
              <div style={{ background: 'white' }}>
                <Button type={'primary'} className="secondary-btn">
                  Next Step
                </Button>
              </div>
            ),
          },
  }));
};

export const joyrideCallback = async (data, mutation, callback) => {
  const { status, type, lifecycle, action } = data;

  if (
    lifecycle === LIFECYCLE.BEACON &&
    type === EVENTS.BEACON &&
    action === ACTIONS.UPDATE
  ) {
    callback(); // auto open joyride
    return;
  }

  if (type === EVENTS.TOUR_END) {
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      await mutation.mutateAsync();
    }
  }
};
