import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"quantity-woc-non-repeating-options-only",text:"Enter a quantity",type:"quantity",repeats:!1,answerConstraint:"optionsOnly",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),n=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/quantity/without item-control/non-repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:n},render:r=>a.jsx(t,{scenario:{name:"quantity-woc-non-repeating-options-only",title:"options only",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-woc-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const q=["OptionsOnly"];export{e as OptionsOnly,q as __namedExportsOrder,f as default};
