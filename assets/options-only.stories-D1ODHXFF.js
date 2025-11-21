import{j as r}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"quantity-wc-autocomplete-non-repeating-options-only",text:"Enter a quantity",type:"quantity",repeats:!1,control:"autocomplete",answerConstraint:"optionsOnly",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),t=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/quantity/with item-control/autocomplete/non-repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:t},render:a=>r.jsx(o,{scenario:{name:"quantity-wc-autocomplete-non-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:a.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-autocomplete-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const q=["OptionsOnly"];export{e as OptionsOnly,q as __namedExportsOrder,f as default};
