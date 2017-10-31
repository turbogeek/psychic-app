/**
 * Created by turbogeek on 10/19/17.
 */
// https://www.jeremysaid.com/blog/the-forer-effect-how-to-convert-your-customers-with-flattery/

// import {RuleReactor} from'./rule-reactor.js';
//import './psych-data.js';
import {Rube, IntQuestionD, BooleanQuestionD, LevelQuestionD, ListQuestionD} from "./psych-data";

var RuleReactor = require("rule-reactor");
//var reactor = new RuleReactor();
// define the business object model consisting of
// Patient, Diagnosis, and Treatment. Diagnosis
// and Treament instances will be created by rules.
//questions = [];
/**
 * The code of the system is a rube.
 */
//console.log('RuleReactor:'+RuleReactor)


var reactor = new RuleReactor({
    Rube: Rube,
    BooleanQuestionD: BooleanQuestionD,
    IntQuestionD: IntQuestionD,
    LevelQuestionD: LevelQuestionD
}, true);
reactor.trace(3);


function not() {
    return RuleReactor.not2.apply(reactor, arguments);
}

function exists() {
    return RuleReactor.exists2.apply(reactor, arguments);
}

//------------------------------

function askIntQuestion(question) {
    console.log("\n\n\n\nAsking: " + question.question);
    question.value = 2;
}

function askBooleanQuestion(question) {
    console.log("\n\n\n\nAsking: " + question.question);
    question.value = true;
}

function askLevelQuestion(question) {
    console.log("Asking Level: ", question);
    let rand = Math.floor((Math.random() * (question.list.length - 1)) + 0);
    question.value = question.list[rand];
    console.log("Asking Level: " + question.question + "= " + question.value);
}

function askListQuestion(question) {
    let rand = Math.floor((Math.random() * (question.list.length - 1)) + 0);
    question.value = question.list[rand];
    console.log("Asking List: " + question.question + "= " + question.value);

}


//reactor.createRule("stop", -1, {},
//function () {
//return not(exists({p: Patient},
//function (p) {
//return p.treatment == undefined;
//}));
//},
//function () {
//reactor.stop();
//});

// =============================================================

reactor.createRule("stop", -1, {r: Rube},
    function (r) {
        return r.done !== undefined;
    },
    function () {
        console.log("Completed answering questions.");
        reactor.stop();
    });

//reactor.createRule("Lover", 0, {q: BooleanQuestion, r: Rube},
//function (r) {
//return r.married || r.girlfriend || r.boyfriend;
//},
//function (r) {
//r.hasLover = true;
//});
reactor.createRule("CheckForDone", 0, {r: Rube},
    function (r) {
        console.log("CheckForDone: ", r);
        return r.married !== undefined
            && r.girlfriend !== undefined
            && r.boyfriend !== undefined
            && r.hasLover !== undefined
            && r.done === undefined
            && r.male !== undefined
            && r.female !== undefined
            && r.barnumList.length === r.barnumCount;
    },
    function (r) {
        r.done = true;
        console.log("Final Rube:", r);
    });

reactor.createRule("CheckForMarried", 0, {q: BooleanQuestionD, r: Rube},
    function (q, r) {
        console.log("CheckForMarried, rube: " + JSON.stringify(r) + " q:" + JSON.stringify(q));
        return r.married === undefined &&
            q.name === "WeddingRing"
            && q.value === undefined;
    },
    function (q) {
        console.log("\nChecking for Married");
        askBooleanQuestion(q);
    });
// Has ring, so married
reactor.createRule("Married", 0, {q: BooleanQuestionD, r: Rube},
    function (q) {
        return q.name === "WeddingRing"
            && q.value === true;
    },
    function (r) {
        console.log("Married");
        r.hasLover = true;
        r.married = true;
        r.girlfriend = false;
        r.boyfriend = false;


    });
//Find the sex with an out
let findSexWithOut = new ListQuestionD("FindSexWithOut", "Please select a statement that best describes you", [
    "I am an independent think thinking woman.",//0 female
    "I am an independent think thinking man.",//1 male
    "I am a woman that follows the crowd.",//2 female
    "I am a man that follows the crowd."//3 male
]);
reactor.assert(findSexWithOut);
reactor.createRule("FigureOutSex", 0, {q: ListQuestionD, r: Rube},
    function (q) {
        return q.name === "FindSexWithOut"
            && q.value === undefined;
    },
    function (q) {
        console.log("find sex");
        askListQuestion(q);
    });
reactor.createRule("Female", 0, {q: ListQuestionD, r: Rube},
    function (q) {
        return q.name === "FindSexWithOut"
            && q.value !== undefined
            && (q.value === q.list[0] || q.value === q.list[2] );
    },
    function (r) {
        console.log("female");
        r.male = false;
        r.female = true;
    });
reactor.createRule("Male", 0, {q: BooleanQuestionD, r: Rube},
    function (q) {
        return q.name === "FindSexWithOut"
            && q.value !== undefined
            && (q.value === q.list[1] || q.value === q.list[3] );
    },
    function (r) {
        console.log("male");
        r.male = true;
        r.female = false;
    });
// No wedding ring, so single
reactor.createRule("Single", 0, {q: BooleanQuestionD, r: Rube},
    function (q) {
        return q.name === "WeddingRing"
            && q.value === false;
    },
    function (r) {
        console.log("Single");
        r.married = false;
        r.single = true;
    });
reactor.createRule("HasChildren", 0, {q: BooleanQuestionD, r: Rube},
    function (q) {
        return q.name === "HasChildren"
            && q.value === true;
    },
    function (r) {
        r.isParent = true;
        let newQ = new IntQuestionD("Children", "How many children?");

        newQ.value = true;
        //questions.push(newQ);
        reactor.assert(newQ);

    });
reactor.createRule("ChildrenUnknown", 0, {q: IntQuestionD, r: Rube},
    function (q) {
        return q.name === "HasChildren"
            && q.value === undefined;
    },
    function (r, q) {
        console.log("asking question");

        askBooleanQuestion(q);
    });


reactor.createRule("ChildrenNumberOne", 0, {q: IntQuestionD, r: Rube},
    function (q) {
        return q.name === "Children"
            && q.value === 1;
    },
    function (r, q) {
        r.childrenCount = q.value;
        let qq = new IntQuestionD("YoungestChildAge", "How old is your first child?");
        askIntQuestion(qq);
        reactor.assert(qq);
        let qq2 = new IntQuestionD("EldistChildAge", "How old is your oldest child?");
        askIntQuestion(qq2);
        reactor.assert(qq2);
    });

reactor.createRule("ChildrenNumberMore", 0, {q: IntQuestionD, r: Rube},
    function (q) {
        return q.name === "Children"
            && q.value > 1;
    },
    function (r, q) {
        r.childrenCount = q.value;
        let qq = new IntQuestionD("EldistChildAge", "How old is yout first child?");
        askIntQuestion(qq);
        reactor.assert(qq);
    });

reactor.createRule("ChooseyMomBarnum", 0, {q: IntQuestionD, r: Rube, q2: LevelQuestionD},
    function (q, r, q2) {
        return q.name === "Children"
            && q.value > 1
            && q2.name === "ChoosyMomBarnum"
            && q2.value === undefined
            && r.female === true;
    },
    function (r, q, q2) {
        askLevelQuestion(q2);
    });
reactor.createRule("ChooseyDadBarnum", 0, {q: IntQuestionD, r: Rube, q2: LevelQuestionD},
    function (q, r, q2) {
        return q.name === "Children"
            && q.value > 1
            && q2.name === "ChoosyDadBarnum"
            && q2.value === undefined
            && r.male === true;
    },
    function (r, q, q2) {
        askLevelQuestion(q2);
    });
reactor.createRule("AskBarnum!", 0, {q: LevelQuestionD, r: Rube},
    function (q) {
        return q.name === "Barnum1"
            && q.value === undefined;
    },
    function (r, q) {
        r.childrenCount = q.value;
        askLevelQuestion(q);
        r.barnumCount++;
    });

//=============================


let barnumList = [new LevelQuestionD("Barnum1", "You have a great need for other people to like and admire you"),
    new LevelQuestionD("Barnum1", "You have a tendency to be critical of yourself"),
    new LevelQuestionD("Barnum1", "You have a great deal of untapped potential"),
    new LevelQuestionD("Barnum1", "While you have some personality weaknesses, you are generally able to compensate for them"),
    new LevelQuestionD("Barnum1", "Disciplined and self-controlled outside, you tend to be worrisome and insecure inside"),
    new LevelQuestionD("Barnum1", "At times you have serious doubts as to whether you have made the right decision or done the right thing"),
    new LevelQuestionD("Barnum1", "You prefer a certain amount of change and variety and become dissatisfied when hemmed in by restrictions and limitations"),
    new LevelQuestionD("Barnum1", "You pride yourself as an independent thinker and do not accept others' statements without satisfactory proof"),
    new LevelQuestionD("Barnum1", "You have found it unwise to be too frank in revealing your thoughts and emotions to others"),
    new LevelQuestionD("Barnum1", "At times you are extroverted, affable, sociable, while at other times you are introverted, wary, reserved"),
    new LevelQuestionD("Barnum1", "Some of your aspirations tend to be pretty unrealistic"),
    new LevelQuestionD("Barnum1", "Security is one of your goals in life"),
    new LevelQuestionD("Barnum1", "You have trouble making decisions when faced with multiple options."),
    new LevelQuestionD("Barnum1", "Most of the time you are positive and cheerful, but there has been a time in the past when you were very upset."),
    new LevelQuestionD("Barnum1", "You are a very kind and considerate person, but when somebody does something to break your trust, you feel deep-seated anger."),
    new LevelQuestionD("Barnum1", "I would say that you are mostly shy and quiet, but when the mood strikes you, you can easily become the center of attention."),
    new LevelQuestionD("Barnum1", "You can take the initiative when called upon, but you can also be a team player when needed"),
    new LevelQuestionD("Barnum1", "You have a tendency to daydream and build castles in the air, but this has not stopped you from leading an active life"),
    new LevelQuestionD("Barnum1", "You are above average in intelligence or mental alertness. You are above average in accuracy; in fact, you are rather painstaking at times"),
    new LevelQuestionD("Barnum1", "You have a tendency to worry, but not excessively. You sometimes get depressed, but are generally cheerful and rather optimistic")
];

let barnumCount = barnumList.length;// count of barnum statements.
for (let value of barnumList) {
    reactor.assert(value);
    console.log(value);
}

let weddingBandQ = new BooleanQuestionD("WeddingRing", "Do you wear a wedding ring?");
let hasChildrenQ = new BooleanQuestionD("HasChildren", "Any children?", 1);

let choosyMom = new LevelQuestionD("ChoosyMomBarnum", "You are a choosy mom");
let choosyDad = new LevelQuestionD("ChoosyDadBarnum", "You are a choosy dad");


reactor.assert(choosyMom);
reactor.assert(choosyDad);


//questions.push(weddingBandQ);

//questions.push(hasChildrenQ);
let looking4LoveQ = new BooleanQuestionD("LookingForLove", "Are you looking for love?");
let single = new BooleanQuestionD("Single", "Do you live alone?");


//IntQuestion("ChildrenNumber", "How many kids?"));

//console.log(questions);


//questions.forEach( function(qq) {
//console.log("add asserting",qq);
//reactor.assert(qq);
//});


//let kids = new IntQuestion("ChildrenNumber", "How many kids?");
//questions.push(kids);
//reactor.assert(rube);
//q2.skip = true;
//let q2 = new IntQuestion("ChildAge", "How old?");
/////reactor.assert(rube);
//q2.skip = true;


let rube = new Rube();
rube.barnumCount = barnumCount;
rube.barnumList = barnumList;
reactor.assert(rube);
reactor.assert(weddingBandQ);
//reactor.assert(hasChildrenQ);
//reactor.assert(looking4LoveQ);
//reactor.assert(single);


reactor.run(Infinity, true, function () {
    console.log(JSON.stringify(rube));
});
console.log("Another rube:", JSON.stringify(rube));
console.log("hello");
export {Rube};