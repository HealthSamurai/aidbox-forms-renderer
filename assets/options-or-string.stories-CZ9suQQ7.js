import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"integer-woc-repeating-options-or-string",text:"Enter integer value",type:"integer",repeats:!0,answerConstraint:"optionsOrString",answerOption:u("integer",[1,2,3])}),r=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/integer/without item-control/repeating/with answer-options",component:t,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:r},render:o=>i.jsx(t,{scenario:{name:"integer-woc-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:o.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-woc-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
