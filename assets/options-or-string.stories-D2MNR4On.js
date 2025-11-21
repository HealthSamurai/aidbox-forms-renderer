import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"integer-wc-drop-down-repeating-options-or-string",text:"Enter integer value",type:"integer",repeats:!0,control:"drop-down",answerConstraint:"optionsOrString",answerOption:u("integer",[1,2,3])}),r=JSON.stringify(n.form.questionnaire,null,2),w={title:"Question/integer/with item-control/drop-down/repeating/with answer-options",component:o,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:r},render:t=>i.jsx(o,{scenario:{name:"integer-wc-drop-down-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-drop-down-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,w as default};
