import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as e,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"string-wc-radio-button-repeating-options-or-string",text:"Enter text",type:"string",repeats:!0,control:"radio-button",answerConstraint:"optionsOrString",answerOption:p("string",["Alpha","Bravo","Charlie"])}),t=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/string/with item-control/radio-button/repeating/with answer-options",component:e,parameters:a,argTypes:s},r={name:"options or string",args:{questionnaireSource:t},render:n=>i.jsx(e,{scenario:{name:"string-wc-radio-button-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:t})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-radio-button-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...r.parameters?.docs?.source}}};const b=["OptionsOrString"];export{r as OptionsOrString,b as __namedExportsOrder,f as default};
