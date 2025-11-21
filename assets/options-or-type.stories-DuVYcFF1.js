import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"integer-wc-spinner-non-repeating-options-or-type",text:"Enter integer value",type:"integer",repeats:!1,control:"spinner",answerConstraint:"optionsOrType",answerOption:u("integer",[1,2,3])}),n=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/integer/with item-control/spinner/non-repeating/with answer-options",component:r,parameters:a,argTypes:i},e={name:"options or type",args:{questionnaireSource:n},render:t=>s.jsx(r,{scenario:{name:"integer-wc-spinner-non-repeating-options-or-type",title:"options or type",build:()=>o},questionnaireSource:t.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-spinner-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
