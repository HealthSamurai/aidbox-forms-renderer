import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as e,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"string-wc-radio-button-non-repeating-options-or-string",text:"Enter text",type:"string",repeats:!1,control:"radio-button",answerConstraint:"optionsOrString",answerOption:p("string",["Alpha","Bravo","Charlie"])}),t=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/string/with item-control/radio-button/non-repeating/with answer-options",component:e,parameters:a,argTypes:i},r={name:"options or string",args:{questionnaireSource:t},render:o=>s.jsx(e,{scenario:{name:"string-wc-radio-button-non-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:o.questionnaireSource,defaultSource:t})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-radio-button-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...r.parameters?.docs?.source}}};const b=["OptionsOrString"];export{r as OptionsOrString,b as __namedExportsOrder,f as default};
