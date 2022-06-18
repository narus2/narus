// To parse this data:
//
//   import { Convert, Cv } from "./file";
//
//   const cv = Convert.toCv(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Cv {
    additionals:     Additional[];
    contact:         Contact;
    educations:      Education[];
    experiences:     Experience[];
    languages:       Language[];
    personal:        Personal;
    photo:           string;
    position:        Position;
    skill:           Skill;
    state:           State;
    trainings:       Training[];
    uiLanguage:      number;
    searchState:     number;
    updateDate:      Date;
    rtfLink:         string;
    viewLink:        string;
    resumeCount:     number;
    diiaCertificate: string;
    resumeId:        number;
}

export interface Additional {
    id:          number;
    title:       string;
    description: string;
    resumeId:    number;
}

export interface Contact {
    email:            string;
    isPhoneConfirmed: boolean;
    phone:            string;
    skype:            string;
    additionalPhones: any[];
    portfolio:        string[];
    socialNetworks:   SocialNetwork[];
    resumeId:         number;
}

export interface SocialNetwork {
    type:    number;
    subType: number;
    text:    string;
}

export interface Education {
    id:         number;
    typeId:     number;
    schoolName: string;
    location:   string;
    speciality: string;
    year:       number;
    diploma:    string;
    resumeId:   number;
}

export interface Experience {
    startWork:          Date;
    endWork:            Date;
    id:                 number;
    branchId:           number;
    notebookCompanyId:  number;
    position:           string;
    company:            string;
    description:        string;
    period:             string;
    recommendationList: any[];
    resumeId:           number;
}

export interface Language {
    languageId:         number;
    skillsLevel:        number;
    skillName:          string;
    languageName:       string;
    certificate:        string;
    isCanBeInterviewed: boolean;
    resumeId:           number;
}

export interface Personal {
    name:        string;
    middleName:  string;
    surName:     string;
    dateBirth:   Date;
    gender:      number;
    cityId:      number;
    moving:      number[];
    districtIds: number[];
    resumeId:    number;
}

export interface Position {
    position:    string;
    scheduleId:  number;
    scheduleIds: number[];
    salary:      number;
    currencyId:  number;
    rubrics:     Rubric[];
    resumeId:    number;
}

export interface Rubric {
    parentId:     number;
    experienceId: number;
    vacCount:     number;
    id:           number;
    ru:           null;
    ua:           null;
    en:           null;
}

export interface Skill {
    text:     string;
    resumeId: number;
}

export interface State {
    level:      number;
    anonymous:  boolean;
    branchIds:  any[];
    companyIds: any[];
    viewCount:  number;
    banReason:  any[];
    active:     boolean;
    isDeleted:  boolean;
    ukrainian:  null;
    resumeId:   number;
}

export interface Training {
    id:          number;
    name:        string;
    location:    string;
    description: string;
    year:        number;
    resumeId:    number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCv(json: string): Cv {
        return cast(JSON.parse(json), r("Cv"));
    }

    public static cvToJson(value: Cv): string {
        return JSON.stringify(uncast(value, r("Cv")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Cv": o([
        { json: "additionals", js: "additionals", typ: a(r("Additional")) },
        { json: "contact", js: "contact", typ: r("Contact") },
        { json: "educations", js: "educations", typ: a(r("Education")) },
        { json: "experiences", js: "experiences", typ: a(r("Experience")) },
        { json: "languages", js: "languages", typ: a(r("Language")) },
        { json: "personal", js: "personal", typ: r("Personal") },
        { json: "photo", js: "photo", typ: "" },
        { json: "position", js: "position", typ: r("Position") },
        { json: "skill", js: "skill", typ: r("Skill") },
        { json: "state", js: "state", typ: r("State") },
        { json: "trainings", js: "trainings", typ: a(r("Training")) },
        { json: "uiLanguage", js: "uiLanguage", typ: 0 },
        { json: "searchState", js: "searchState", typ: 0 },
        { json: "updateDate", js: "updateDate", typ: Date },
        { json: "rtfLink", js: "rtfLink", typ: "" },
        { json: "viewLink", js: "viewLink", typ: "" },
        { json: "resumeCount", js: "resumeCount", typ: 0 },
        { json: "diiaCertificate", js: "diiaCertificate", typ: "" },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "Additional": o([
        { json: "id", js: "id", typ: 0 },
        { json: "title", js: "title", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "Contact": o([
        { json: "email", js: "email", typ: "" },
        { json: "isPhoneConfirmed", js: "isPhoneConfirmed", typ: true },
        { json: "phone", js: "phone", typ: "" },
        { json: "skype", js: "skype", typ: "" },
        { json: "additionalPhones", js: "additionalPhones", typ: a("any") },
        { json: "portfolio", js: "portfolio", typ: a("") },
        { json: "socialNetworks", js: "socialNetworks", typ: a(r("SocialNetwork")) },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "SocialNetwork": o([
        { json: "type", js: "type", typ: 0 },
        { json: "subType", js: "subType", typ: 0 },
        { json: "text", js: "text", typ: "" },
    ], false),
    "Education": o([
        { json: "id", js: "id", typ: 0 },
        { json: "typeId", js: "typeId", typ: 0 },
        { json: "schoolName", js: "schoolName", typ: "" },
        { json: "location", js: "location", typ: "" },
        { json: "speciality", js: "speciality", typ: "" },
        { json: "year", js: "year", typ: 0 },
        { json: "diploma", js: "diploma", typ: "" },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "Experience": o([
        { json: "startWork", js: "startWork", typ: Date },
        { json: "endWork", js: "endWork", typ: Date },
        { json: "id", js: "id", typ: 0 },
        { json: "branchId", js: "branchId", typ: 0 },
        { json: "notebookCompanyId", js: "notebookCompanyId", typ: 0 },
        { json: "position", js: "position", typ: "" },
        { json: "company", js: "company", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "period", js: "period", typ: "" },
        { json: "recommendationList", js: "recommendationList", typ: a("any") },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "Language": o([
        { json: "languageId", js: "languageId", typ: 0 },
        { json: "skillsLevel", js: "skillsLevel", typ: 0 },
        { json: "skillName", js: "skillName", typ: "" },
        { json: "languageName", js: "languageName", typ: "" },
        { json: "certificate", js: "certificate", typ: "" },
        { json: "isCanBeInterviewed", js: "isCanBeInterviewed", typ: true },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "Personal": o([
        { json: "name", js: "name", typ: "" },
        { json: "middleName", js: "middleName", typ: "" },
        { json: "surName", js: "surName", typ: "" },
        { json: "dateBirth", js: "dateBirth", typ: Date },
        { json: "gender", js: "gender", typ: 0 },
        { json: "cityId", js: "cityId", typ: 0 },
        { json: "moving", js: "moving", typ: a(0) },
        { json: "districtIds", js: "districtIds", typ: a(0) },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "Position": o([
        { json: "position", js: "position", typ: "" },
        { json: "scheduleId", js: "scheduleId", typ: 0 },
        { json: "scheduleIds", js: "scheduleIds", typ: a(0) },
        { json: "salary", js: "salary", typ: 0 },
        { json: "currencyId", js: "currencyId", typ: 0 },
        { json: "rubrics", js: "rubrics", typ: a(r("Rubric")) },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "Rubric": o([
        { json: "parentId", js: "parentId", typ: 0 },
        { json: "experienceId", js: "experienceId", typ: 0 },
        { json: "vacCount", js: "vacCount", typ: 0 },
        { json: "id", js: "id", typ: 0 },
        { json: "ru", js: "ru", typ: null },
        { json: "ua", js: "ua", typ: null },
        { json: "en", js: "en", typ: null },
    ], false),
    "Skill": o([
        { json: "text", js: "text", typ: "" },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "State": o([
        { json: "level", js: "level", typ: 0 },
        { json: "anonymous", js: "anonymous", typ: true },
        { json: "branchIds", js: "branchIds", typ: a("any") },
        { json: "companyIds", js: "companyIds", typ: a("any") },
        { json: "viewCount", js: "viewCount", typ: 0 },
        { json: "banReason", js: "banReason", typ: a("any") },
        { json: "active", js: "active", typ: true },
        { json: "isDeleted", js: "isDeleted", typ: true },
        { json: "ukrainian", js: "ukrainian", typ: null },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
    "Training": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "location", js: "location", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "year", js: "year", typ: 0 },
        { json: "resumeId", js: "resumeId", typ: 0 },
    ], false),
};
