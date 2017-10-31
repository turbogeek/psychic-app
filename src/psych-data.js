/**
 * Created by turbogeek on 10/22/17.
 */
class QuestionD {
    constructor() {
        this.name = "ErrorNameNotSet";
        this.question = "ErrorQuestionNotSet";
        //this.value ;
        this.skip = false;
    }
}

export class BooleanQuestionD extends QuestionD {
    constructor(key, question, value, skip) {
        super();
        this.name = key;
        this.question = question;
        this.value = value;
        this.skip = skip;
    }
}

export class LevelQuestionD extends QuestionD {
    constructor(key, question, value, skip) {
        super();
        this.list = ["Yes!", "Maybe", "No"];
        this.name = key;
        this.question = question;
        this.value = value;
        this.skip = skip;
    }
}

export class ListQuestionD extends QuestionD {
    constructor(key, question, list, value, skip) {
        super();
        this.list = list;
        this.name = key;
        this.question = question;
        this.value = value;
        this.skip = skip;
    }
}

export class IntQuestionD extends QuestionD {
    constructor(key, question, value, skip) {
        super();
        this.name = key;
        this.question = question;
        this.value = value;
        this.skip = skip;
    }
}

export function Rube() {
    this.name = 'Harry';
    this.married = undefined;
    this.girlfriend = undefined;
    this.boyfriend = undefined;
    this.hasLover = undefined;
    this.done = undefined;
    this.barnumList = undefined;
    this.male = undefined;
    this.female = undefined;
}