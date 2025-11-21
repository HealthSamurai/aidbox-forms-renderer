import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as u,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"quantity-wc-slider-repeating-options-only",text:"Enter a quantity",type:"quantity",repeats:!0,control:"slider",answerConstraint:"optionsOnly",answerOption:l("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),t=JSON.stringify(o.form.questionnaire,null,2),q={title:"Question/quantity/with item-control/slider/repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:t},render:r=>s.jsx(n,{scenario:{name:"quantity-wc-slider-repeating-options-only",title:"options only",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-slider-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOnly"];export{e as OptionsOnly,S as __namedExportsOrder,q as default};
