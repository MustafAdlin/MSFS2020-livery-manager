import fs from 'fs';
import * as ini from './parser';
import ThrowError from '../../ThrowError';

let CFGpath = '';
const pathRegEx = /^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}[\]]+)+\.cfg$/i;

/**
 * Set path to a CFG file
 *
 * @export
 * @argument {String} path  Set path to CFG file
 */

export function loadCFG(path) {
  if (!pathRegEx.test(path) || !fs.lstatSync(path).isFile()) return false;
  CFGpath = path;
  return true;
}
/**
 * Parse the chosen CFG file and return it
 *
 * @export
 * @return {Object} JSON object with the CFG file data
 */

export function parseCFGFile() {
  if (!pathRegEx.test(CFGpath) || !fs.lstatSync(CFGpath).isFile()) ThrowError('E005', `Invalid path ${CFGpath}`);
  const data = ini.parse(fs.readFileSync(CFGpath, 'utf8'));
  return data;
}

/**
 * Get the highest plane number in the set .CFG file
 *
 * @export
 * @return {Number} Number of the highest plane in the file
 */

export function getHighestPlaneNumber() {
  let highest = 0;
  const data = parseCFGFile();
  Object.keys(data.FLTSIM).forEach(function (key) {
    key = parseInt(key);
    if (key > highest) highest = key;
  });

  return highest;
}

/**
 * Get an array of planeNumbers to use with FLTSIM.
 *
 * @export
 * @return {IntArray} Array of planeNumbers for FLTSIM
 */
export function getPlaneNumberKeys() {
  let keys = [];
  const data = parseCFGFile();
  Object.keys(data.FLTSIM).forEach(function (key) {
    key = parseInt(key);
    keys.push(key);
  });

  return keys;
}

/**
 * Add airplane object to CFG FIle
 *
 * @export
 * @argument {Object} airplaneObject Pass the airplane json object to add it to the .CFG file
 * @argument {Number} planeNumber Plane number for in the aircraft.cfg, only do when overriding!
 * @example addAirplane({"title":"Airbus A320 Neo Asobo","model":"","panel":"","sound":"","texture":"","kb_checklists":"Boeing747-400_check","kb_reference":"Boeing747-400_ref","description":"TT:AIRCRAFT.DESCRIPTION","wip_indicator":0,"ui_manufacturer":"TT:AIRCRAFT.UI_MANUFACTURER","ui_type":"TT:AIRCRAFT.UI_MODEL","ui_variation":"TT:AIRCRAFT.LIVERY.DEFAULT","ui_typerole":"Commercial Airliner","ui_createdby":"Asobo Studio","ui_thumbnailfile":"","ui_certified_ceiling":"39800","ui_max_range":"3500","ui_autonomy":"7","ui_fuel_burn_rate":"5300","atc_id":"ASX320","atc_id_enable":"0","atc_airline":"","atc_flight_number":"1123","atc_heavy":"1","atc_parking_types":"GATE,RAMP,CARGO","atc_parking_codes":"","atc_id_color":"","atc_id_font":"","isAirTraffic":"0","isUserSelectable":"1"})
 */
export function addAirplane(airplaneObject, planeNumber) {
  planeNumber = planeNumber || getHighestPlaneNumber() + 1;
  //Check if all values are in here, if not set them to an empty string :)
  airplaneObject = checkAirplaneObject(airplaneObject);
  let airplaneCFG = parseCFGFile();
  airplaneCFG.FLTSIM[planeNumber] = airplaneObject;
  fs.writeFileSync(CFGpath, ini.stringify(airplaneCFG));
  return;
}

/**
 * Remove airplane object from the CFG file by FLTSIM number
 *
 * @export
 * @argument {Number} planeNumber Plane number for in the aircraft.cfg
 * @example removeAirplane(63)
 */
export function removeAirplane(planeNumber) {
  let airplaneCFG = parseCFGFile();
  delete airplaneCFG.FLTSIM[planeNumber];
  fs.writeFileSync(CFGpath, ini.stringify(airplaneCFG));
  return;
}

/**
 * Check if plane number exists in CFG File
 *
 * @export
 * @argument {Number} planeNumber Plane number to check FLTSIM.number
 * @returns {Boolean} true:false
 * @example doesPlaneNumberExist(64)
 */
export function doesPlaneNumberExist(planeNumber) {
  const data = parseCFGFile();
  return data.FLTSIM[planeNumber] != undefined;
}

/**
 * Check if the airplane object is valid, and change when needed
 *
 * @export
 * @argument {Object} airplaneObject Airplane object to validate
 * @returns {Object} Validated airplaneObject
 * @example  checkAirplaneObject({"title": "Airbus A320", "model": ""})
 */
export function checkAirplaneObject(airplaneObject) {
  //Check and set values when needed
  if (typeof airplaneObject.title != 'string') airplaneObject.title = 'Airbus A320 Neo Asobo';
  if (typeof airplaneObject.model != 'string') airplaneObject.model = '';
  if (typeof airplaneObject.panel != 'string') airplaneObject.panel = '';
  if (typeof airplaneObject.sound != 'string') airplaneObject.sound = '';
  if (typeof airplaneObject.texture != 'string') airplaneObject.texture = '';
  if (typeof airplaneObject.kb_checklists != 'string') airplaneObject.kb_checklists = 'Boeing747-400_check';
  if (typeof airplaneObject.kb_reference != 'string') airplaneObject.kb_reference = 'Boeing747-400_ref';
  if (typeof airplaneObject.description != 'string') airplaneObject.description = 'TT:AIRCRAFT.DESCRIPTION';
  if (typeof airplaneObject.wip_indicator != 'number') airplaneObject.wip_indicator = 0;
  if (typeof airplaneObject.ui_manufacturer != 'string') airplaneObject.ui_manufacturer = 'TT:AIRCRAFT.UI_MANUFACTURER';
  if (typeof airplaneObject.ui_type != 'string') airplaneObject.ui_type = 'A320neo';
  if (typeof airplaneObject.ui_variation != 'string') airplaneObject.ui_variation = 'A320neo';
  if (typeof airplaneObject.ui_typerole != 'string') airplaneObject.ui_typerole = 'Commercial Airliner';
  if (typeof airplaneObject.ui_createdby != 'string') airplaneObject.ui_createdby = 'Asobo Studio';
  if (typeof airplaneObject.ui_thumbnailfile != 'string') airplaneObject.ui_thumbnailfile = '';
  if (typeof airplaneObject.ui_certified_ceiling != 'number') airplaneObject.ui_certified_ceiling = 39800;
  if (typeof airplaneObject.ui_max_range != 'number') airplaneObject.ui_max_range = 3500;
  if (typeof airplaneObject.ui_autonomy != 'number') airplaneObject.ui_autonomy = 7;
  if (typeof airplaneObject.ui_fuel_burn_rate != 'number') airplaneObject.ui_fuel_burn_rate = 5300;
  if (typeof airplaneObject.atc_id != 'string') airplaneObject.atc_id = 'I-ADJU';
  if (typeof airplaneObject.atc_id_enable != 'number') airplaneObject.atc_id_enable = 0;
  if (typeof airplaneObject.atc_airline != 'string') airplaneObject.atc_airline = 'DLA';
  if (typeof airplaneObject.atc_flight_number != 'string') airplaneObject.atc_flight_number = '1123';
  if (typeof airplaneObject.atc_heavy != 'number') airplaneObject.atc_heavy = 1;
  if (typeof airplaneObject.atc_parking_types != 'string') airplaneObject.atc_heavy = 'GATE,RAMP,CARGO';
  if (typeof airplaneObject.atc_parking_codes != 'string') airplaneObject.atc_parking_codes = '';
  if (typeof airplaneObject.atc_id_color != 'string') airplaneObject.atc_id_color = '';
  if (typeof airplaneObject.atc_id_font != 'string') airplaneObject.atc_heavy = '';
  if (typeof airplaneObject.icao_airline != 'string') airplaneObject.atc_heavy = 'DLA';
  if (typeof airplaneObject.isAirTraffic != 'number') airplaneObject.isAirTraffic = 0;
  if (typeof airplaneObject.isUserSelectable != 'number') airplaneObject.isUserSelectable = 1;

  return airplaneObject;
}
