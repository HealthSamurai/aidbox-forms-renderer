import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"quantity-wc-spinner-repeating-options-or-type",text:"Enter a quantity",type:"quantity",repeats:!0,control:"spinner",answerConstraint:"optionsOrType",answerOption:u("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),t=JSON.stringify(r.form.questionnaire,null,2),q={title:"Question/quantity/with item-control/spinner/repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:t},render:o=>s.jsx(n,{scenario:{name:"quantity-wc-spinner-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:o.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-spinner-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOrType"];export{e as OptionsOrType,S as __namedExportsOrder,q as default};
