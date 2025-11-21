import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as u,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"quantity-wc-slider-non-repeating-options-only",text:"Enter a quantity",type:"quantity",repeats:!1,control:"slider",answerConstraint:"optionsOnly",answerOption:l("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),n=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/quantity/with item-control/slider/non-repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:n},render:r=>s.jsx(t,{scenario:{name:"quantity-wc-slider-non-repeating-options-only",title:"options only",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-slider-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const q=["OptionsOnly"];export{e as OptionsOnly,q as __namedExportsOrder,f as default};
