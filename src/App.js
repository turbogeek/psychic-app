import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
// import './rule-reactor-es6.js';
import {BooleanQuestionD} from './psych-data.js';
//https://cssauthor.com/reactjs-admin-themes/
//console.log("pre Rube:");
import {Rube} from './psych-rules.js';

console.log("Rube:" + Rube);

class QuestionForm extends React.Component {

    constructor() {
        super();
        this.state = {
            name: '',
            questions: [new BooleanQuestionD("WeddingRing", "Do you wear a wedding ring?")
                , new BooleanQuestionD('HasChildren', 'Any children??')
            ]
            //shareholders: [{ name: '' }],
        };
    }


    handleNameChange = (evt) => {
        this.setState({name: evt.target.value});
    };

    handleQuestionNameChange = (idx) => (evt) => {
        const newQuestions = this.state.questions.map((question, sidx) => {
            if (idx !== sidx) return question;
            return {...question, name: evt.target.value};
        });

        this.setState({questions: newQuestions});
    };

    handleSubmit = (evt) => {
        const {name, questions} = this.state;
        alert(`Incorporated: ${name} with ${questions.length} questions`);
        console.log("Event:", evt);
    };

    handleAddQuestion = () => {
        this.setState({questions: this.state.questions.concat([{name: ''}])});
    };

    handleRemoveQuestion = (idx) => () => {
        this.setState({questions: this.state.questions.filter((s, sidx) => idx !== sidx)});
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Company name, e.g. Magic Everywhere LLC"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />

                <h4>Questions</h4>

                {this.state.questions.map((question, idx) => (

                    <div className="shareholder">
                        <div className='shareholder'>
                            {question.name}
                        </div>
                        <div className='shareholder'>
                            {question.question}
                        </div>
                        <input
                            type="text"
                            placeholder={`Question #${idx + 1} name`}
                            value={question.key}// was name
                            onChange={this.handleQuestionNameChange(idx)}
                        />
                        <button type="button" onClick={this.handleRemoveQuestion(idx)} className="small">-</button>
                    </div>
                ))}
                <button type="button" onClick={this.handleAddQuestion} className="small">Add Question</button>
                <button>Incorporate</button>
            </form>
        )
    }

}


class App extends Component {
    render() {
        return (
            <div className="App">

                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React and now we test</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <QuestionForm/>
            </div>
        );
    }
}

export default App;


