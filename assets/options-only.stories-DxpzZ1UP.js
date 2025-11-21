import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"integer-wc-drop-down-repeating-options-only",text:"Enter integer value",type:"integer",repeats:!0,control:"drop-down",answerConstraint:"optionsOnly",answerOption:u("integer",[1,2,3])}),o=JSON.stringify(r.form.questionnaire,null,2),y={title:"Question/integer/with item-control/drop-down/repeating/with answer-options",component:n,parameters:a,argTypes:i},e={name:"options only",args:{questionnaireSource:o},render:t=>s.jsx(n,{scenario:{name:"integer-wc-drop-down-repeating-options-only",title:"options only",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-drop-down-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOnly"];export{e as OptionsOnly,S as __namedExportsOrder,y as default};
