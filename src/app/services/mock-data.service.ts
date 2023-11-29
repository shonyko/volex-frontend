import { Injectable } from '@angular/core';
import { Agent } from '../models/agent';
import { of } from 'rxjs';
import { Blueprint } from '../models/blueprint';
import { PairRequest } from '../models/pair-request';

function getIdGenerator() {
  let id = 1;
  return function getId() {
    return id++;
  };
}

function getRandomMac() {
  return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, function () {
    return '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
  });
}

const getBlueprintId = getIdGenerator();

const LED_BLUEPRINT = {
  id: getBlueprintId(),
  displayName: 'LED agent',
  isHardware: true,
  isValid: true,
};

const RGB_BLUEPRINT = {
  id: getBlueprintId(),
  displayName: 'RGB agent',
  isHardware: true,
  isValid: true,
};

const SWITCH_BLUEPRINT = {
  id: getBlueprintId(),
  displayName: 'Switch agent',
  isHardware: true,
  isValid: true,
};

const SLIDER_BLUEPRINT = {
  id: getBlueprintId(),
  displayName: 'Slider agent',
  isHardware: true,
  isValid: true,
};

const TIMER_BLUEPRINT = {
  id: getBlueprintId(),
  displayName: 'Timer',
  isHardware: false,
  isValid: true,
};

const blueprints: Blueprint[] = [
  LED_BLUEPRINT,
  RGB_BLUEPRINT,
  SWITCH_BLUEPRINT,
  SLIDER_BLUEPRINT,
  TIMER_BLUEPRINT,
  {
    id: getBlueprintId(),
    displayName: 'Invalid blueprint',
    isHardware: false,
    isValid: false,
  },
];

const getAgentId = getIdGenerator();

const agents: Agent[] = [
  {
    id: getAgentId(),
    name: 'LED agent',
    blueprintId: LED_BLUEPRINT.id,
    macAddr: getRandomMac(),
  },
  {
    id: getAgentId(),
    name: 'RGB agent',
    blueprintId: RGB_BLUEPRINT.id,
    macAddr: getRandomMac(),
  },
  {
    id: getAgentId(),
    name: 'Switch agent',
    blueprintId: SWITCH_BLUEPRINT.id,
    macAddr: getRandomMac(),
  },
  {
    id: getAgentId(),
    name: 'Slider agent',
    blueprintId: SLIDER_BLUEPRINT.id,
    macAddr: getRandomMac(),
  },
  {
    id: getAgentId(),
    name: 'Timer',
    blueprintId: TIMER_BLUEPRINT.id,
    macAddr: null,
  },
];

const getRequestId = getIdGenerator();

const requests: PairRequest[] = [
  {
    id: getRequestId(),
    blueprintId: LED_BLUEPRINT.id,
    macAddr: getRandomMac(),
    date: new Date().toLocaleString(),
  },
  {
    id: getRequestId(),
    blueprintId: RGB_BLUEPRINT.id,
    macAddr: getRandomMac(),
    date: new Date().toLocaleString(),
  },
  {
    id: getRequestId(),
    blueprintId: SWITCH_BLUEPRINT.id,
    macAddr: getRandomMac(),
    date: new Date().toLocaleString(),
  },
  {
    id: getRequestId(),
    blueprintId: SLIDER_BLUEPRINT.id,
    macAddr: getRandomMac(),
    date: new Date().toLocaleString(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  getAgents() {
    return of(agents);
  }

  getBlueprints() {
    return of(blueprints);
  }

  getRequests() {
    return of(requests);
  }
}
