import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"string-wc-drop-down-non-repeating-options-or-string",text:"Enter text",type:"string",repeats:!1,control:"drop-down",answerConstraint:"optionsOrString",answerOption:u("string",["Alpha","Bravo","Charlie"])}),e=JSON.stringify(o.form.questionnaire,null,2),w={title:"Question/string/with item-control/drop-down/non-repeating/with answer-options",component:n,parameters:a,argTypes:i},r={name:"options or string",args:{questionnaireSource:e},render:t=>s.jsx(n,{scenario:{name:"string-wc-drop-down-non-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:t.questionnaireSource,defaultSource:e})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-drop-down-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...r.parameters?.docs?.source}}};const f=["OptionsOrString"];export{r as OptionsOrString,f as __namedExportsOrder,w as default};
