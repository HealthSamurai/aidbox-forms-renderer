import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"integer-wc-spinner-non-repeating-options-only",text:"Enter integer value",type:"integer",repeats:!1,control:"spinner",answerConstraint:"optionsOnly",answerOption:l("integer",[1,2,3])}),n=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/integer/with item-control/spinner/non-repeating/with answer-options",component:o,parameters:a,argTypes:i},e={name:"options only",args:{questionnaireSource:n},render:t=>s.jsx(o,{scenario:{name:"integer-wc-spinner-non-repeating-options-only",title:"options only",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-spinner-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,S as default};
