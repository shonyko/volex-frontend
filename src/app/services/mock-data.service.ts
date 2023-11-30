import { Injectable } from '@angular/core';
import { Agent } from '../models/agent';
import { of } from 'rxjs';
import { Blueprint } from '../models/blueprint';
import { PairRequest } from '../models/pair-request';
import { Param } from '../models/param';
import { DataType } from '../models/data-type';
import { Pin } from '../models/pin';
import { PinType } from '../models/pin-type';

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

const LED_AGENT = {
  id: getAgentId(),
  name: 'LED agent',
  blueprintId: LED_BLUEPRINT.id,
  macAddr: getRandomMac(),
};

const SWITCH_AGENT = {
  id: getAgentId(),
  name: 'Switch agent',
  blueprintId: SWITCH_BLUEPRINT.id,
  macAddr: getRandomMac(),
};

const agents: Agent[] = [
  LED_AGENT,
  {
    id: getAgentId(),
    name: 'RGB agent',
    blueprintId: RGB_BLUEPRINT.id,
    macAddr: getRandomMac(),
  },
  SWITCH_AGENT,
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

const getParamId = getIdGenerator();

const params: Param[] = [
  {
    id: getParamId(),
    name: 'Publish on change',
    blueprintId: SWITCH_BLUEPRINT.id,
    dataType: DataType.BOOLEAN,
    value: 'true',
    agentId: SWITCH_AGENT.id,
  },
  {
    id: getParamId(),
    name: 'Push period (ms)',
    blueprintId: SWITCH_BLUEPRINT.id,
    dataType: DataType.INTEGER,
    value: '500',
    agentId: SWITCH_AGENT.id,
  },
  {
    id: getParamId(),
    name: 'Color',
    blueprintId: SWITCH_BLUEPRINT.id,
    dataType: DataType.RGB,
    value: '#ff00a2',
    agentId: SWITCH_AGENT.id,
  },
  {
    id: getParamId(),
    name: 'JSON',
    blueprintId: SWITCH_BLUEPRINT.id,
    dataType: DataType.JSON,
    value: '{}',
    agentId: SWITCH_AGENT.id,
  },
];

const getPinId = getIdGenerator();

const SWITCH_PIN = {
  id: getPinId(),
  name: 'Value',
  pinType: PinType.OUT,
  dataType: DataType.BOOLEAN,
  blueprintId: SWITCH_BLUEPRINT.id,
  agentId: SWITCH_AGENT.id,
  value: 'false',
  srcPinId: null,
};

const pins: Pin[] = [
  {
    id: getPinId(),
    name: 'Power',
    pinType: PinType.IN,
    dataType: DataType.BOOLEAN,
    blueprintId: LED_BLUEPRINT.id,
    agentId: LED_AGENT.id,
    value: 'false',
    srcPinId: SWITCH_PIN.id,
  },
  {
    id: getPinId(),
    name: 'Brightness',
    pinType: PinType.IN,
    dataType: DataType.INTEGER,
    blueprintId: LED_BLUEPRINT.id,
    agentId: LED_AGENT.id,
    value: '100',
    srcPinId: null,
  },
  SWITCH_PIN,
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

  getParams() {
    return of(params);
  }

  getPins() {
    return of(pins);
  }
}
