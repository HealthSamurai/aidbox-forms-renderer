import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"quantity-wc-lookup-non-repeating-options-only",text:"Enter a quantity",type:"quantity",repeats:!1,control:"lookup",answerConstraint:"optionsOnly",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),o=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/quantity/with item-control/lookup/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:r=>a.jsx(n,{scenario:{name:"quantity-wc-lookup-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-lookup-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const q=["OptionsOnly"];export{e as OptionsOnly,q as __namedExportsOrder,f as default};
