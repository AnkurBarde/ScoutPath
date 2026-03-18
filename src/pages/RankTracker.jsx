import { useState, useEffect } from 'react'

const ranks = ['Scout', 'Tenderfoot', 'Second Class', 'First Class', 'Star', 'Life', 'Eagle']

const timeRequirements = {
  'Star1': { months: 4, label: '4 months active as First Class Scout' },
  'Star5': { months: 4, label: '4 months in a leadership position' },
  'Life1': { months: 6, label: '6 months active as Star Scout' },
  'Life5': { months: 6, label: '6 months in a leadership position' },
  'Eagle1': { months: 6, label: '6 months active as Life Scout' },
  'Eagle4': { months: 6, label: '6 months in a leadership position' },
}

const requirements = {
  Scout: [
    { id: '1a', text: 'Repeat from memory the Scout Oath, Scout Law, Scout motto, and Scout slogan. In your own words, explain their meaning.' },
    { id: '1b', text: 'Explain what Scout spirit is. Describe some ways you have shown Scout spirit by practicing the Scout Oath, Scout Law, Scout motto, and Scout slogan.' },
    { id: '1c', text: 'Demonstrate the Scout sign, salute, and handshake. Explain when they should be used.' },
    { id: '1d', text: 'Describe the First Class Scout badge and tell what each part stands for. Explain the significance of the First Class Scout badge.' },
    { id: '1e', text: 'Repeat from memory the Outdoor Code. In your own words, explain what the Outdoor Code means to you.' },
    { id: '1f', text: 'Repeat from memory the Pledge of Allegiance. In your own words, explain its meaning.' },
    { id: '2a', text: 'Describe how the Scouts in the troop provide its leadership.' },
    { id: '2b', text: 'Describe the four steps of Scout advancement.' },
    { id: '2c', text: 'Describe what the Scouts BSA ranks are and how they are earned.' },
    { id: '2d', text: 'Describe what merit badges are and how they are earned.' },
    { id: '3a', text: 'Explain the patrol method. Describe the types of patrols that are used in your troop.' },
    { id: '3b', text: 'Become familiar with your patrol name, emblem, flag, and yell. Explain how these items create patrol spirit.' },
    { id: '4a', text: 'Show how to tie a square knot, two half-hitches, and a taut-line hitch. Explain how each knot is used.' },
    { id: '4b', text: 'Show the proper care of a rope by learning how to whip and fuse the ends of different kinds of rope.' },
    { id: '5', text: 'Tell what you need to know about pocketknife safety.' },
    { id: '6', text: "With your parent or guardian, complete the exercises in the pamphlet How to Protect Your Children From Child Abuse: A Parent's Guide and earn the Cyber Chip Award for your grade." },
    { id: '7', text: 'Since joining the troop and while working on the Scout rank, participate in a Scoutmaster conference.' },
  ],
  Tenderfoot: [
    { id: '1a', text: 'Present yourself to your leader, prepared for an overnight camping trip. Show the personal and camping gear you will use. Show the right way to pack and carry it.' },
    { id: '1b', text: 'Spend at least one night on a patrol or troop campout. Sleep in a tent you have helped pitch.' },
    { id: '1c', text: 'Tell how you practiced the Outdoor Code on a campout or outing.' },
    { id: '2a', text: 'On the campout, assist in preparing one of the meals. Tell why it is important for each patrol member to share in meal preparation and cleanup.' },
    { id: '2b', text: 'While on a campout, demonstrate the appropriate method of safely cleaning items used to prepare, serve, and eat a meal.' },
    { id: '2c', text: 'Explain the importance of eating together as a patrol.' },
    { id: '3a', text: 'Demonstrate a practical use of the square knot.' },
    { id: '3b', text: 'Demonstrate a practical use of two half-hitches.' },
    { id: '3c', text: 'Demonstrate a practical use of the taut-line hitch.' },
    { id: '3d', text: 'Demonstrate proper care, sharpening, and use of the knife, saw, and ax. Describe when each should be used.' },
    { id: '4a', text: 'Show first aid for the following: Simple cuts and scrapes; Blisters on the hand and foot; Minor (thermal/heat) burns or scalds (superficial, or first-degree); Bites or stings of insects and ticks; Venomous snakebite; Nosebleed; Frostbite and sunburn; Choking.' },
    { id: '4b', text: 'Describe common poisonous or hazardous plants; identify any that grow in your local area or campsite location. Tell how to treat for exposure to them.' },
    { id: '4c', text: 'Tell what you can do while on a campout or other outdoor activity to prevent or reduce the occurrence of injuries or exposure listed in Tenderfoot requirements 4a and 4b.' },
    { id: '4d', text: 'Assemble a personal first-aid kit to carry with you on future campouts and hikes. Tell how each item in the kit would be used.' },
    { id: '5a', text: 'Explain the importance of the buddy system as it relates to your personal safety on outings and in your neighborhood. Use the buddy system while on a troop or patrol outing.' },
    { id: '5b', text: 'Describe what to do if you become lost on a hike or campout.' },
    { id: '5c', text: 'Explain the rules of safe hiking, both on the highway and cross-country, during the day and at night.' },
    { id: '6a', text: 'Record your best in the following tests: Pushups (Record the number done correctly in 60 seconds.); Situps or curl-ups (Record the number done correctly in 60 seconds.); Back-saver sit-and-reach (Record the distance stretched.); 1-mile walk/run (Record the time.)' },
    { id: '6b', text: 'Develop and describe a plan for improvement in each of the activities listed in Tenderfoot requirement 6a. Keep track of your activity for at least 30 days.' },
    { id: '6c', text: 'Show improvement (of any degree) in each activity listed in Tenderfoot requirement 6a after practicing for 30 days.' },
    { id: '7a', text: 'Demonstrate how to display, raise, lower, and fold the U.S. flag.' },
    { id: '7b', text: 'Participate in a total of one hour of service in one or more service projects approved by your Scoutmaster. Explain how your service to others relates to the Scout slogan and Scout motto.' },
    { id: '8', text: "Describe the steps in Scouting's Teaching EDGE method. Use the Teaching EDGE method to teach another person how to tie the square knot." },
    { id: '9', text: 'Demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God and how you have lived four different points of the Scout Law in your everyday life.' },
    { id: '10', text: 'While working toward the Tenderfoot rank, and after completing Scout rank requirement 7, participate in a Scoutmaster conference.' },
    { id: '11', text: 'Successfully complete your board of review for the Tenderfoot rank.' },
  ],
  'Second Class': [
    { id: '1a', text: 'Since joining Scouts BSA, participate in five separate troop/patrol activities, at least three of which must be held outdoors. Of the outdoor activities, at least two must include overnight camping. These activities do not include troop or patrol meetings. On campouts, spend the night in a tent that you pitch or other structure that you help erect, such as a lean-to, snow cave, or tepee.' },
    { id: '1b', text: 'Explain the principles of Leave No Trace and tell how you practiced them on a campout or outing. This outing must be different from the one used for Tenderfoot requirement 1c.' },
    { id: '1c', text: 'On one of these campouts, select a location for your patrol site and recommend it to your patrol leader, senior patrol leader, or troop guide. Explain what factors you should consider when choosing a patrol site and where to pitch a tent.' },
    { id: '2a', text: 'Explain when it is appropriate to use a fire for cooking or other purposes and when it would not be appropriate to do so.' },
    { id: '2b', text: 'Use the tools listed in Tenderfoot requirement 3d to prepare tinder, kindling, and fuel wood for a cooking fire.' },
    { id: '2c', text: 'At an approved outdoor location and time, use the tinder, kindling, and fuel wood from Second Class requirement 2b to demonstrate how to build a fire. Unless prohibited by local fire restrictions, light the fire. After allowing the flames to burn safely for at least two minutes, safely extinguish the flames with minimal impact to the fire site.' },
    { id: '2d', text: 'Explain when it is appropriate to use a lightweight stove and when it is appropriate to use a propane stove. Set up a lightweight stove or propane stove. Light the stove, unless prohibited by local fire restrictions. Describe the safety procedures for using these types of stoves.' },
    { id: '2e', text: 'On one campout, plan and cook one hot breakfast or lunch, selecting foods from MyPlate or the current USDA nutritional model. Explain the importance of good nutrition. Demonstrate how to transport, store, and prepare the foods you selected.' },
    { id: '2f', text: 'Demonstrate tying the sheet bend knot. Describe a situation in which you would use this knot.' },
    { id: '2g', text: 'Demonstrate tying the bowline knot. Describe a situation in which you would use this knot.' },
    { id: '3a', text: 'Demonstrate how a compass works and how to orient a map. Use a map to point out and tell the meaning of five map symbols.' },
    { id: '3b', text: 'Using a compass and map together, take a 5-mile hike (or 10 miles by bike) approved by your adult leader and your parent or guardian.' },
    { id: '3c', text: 'Describe some hazards or injuries that you might encounter on your hike and what you can do to help prevent them.' },
    { id: '3d', text: 'Demonstrate how to find directions during the day and at night without using a compass or an electronic device.' },
    { id: '4', text: 'Identify or show evidence of at least 10 kinds of wild animals (such as birds, mammals, reptiles, fish, or mollusks) found in your local area or camping location. You may show evidence by tracks, signs, or photographs you have taken.' },
    { id: '5a', text: 'Tell what precautions must be taken for a safe swim.' },
    { id: '5b', text: 'Demonstrate your ability to pass the BSA beginner test: Jump feetfirst into water over your head in depth, level off and swim 25 feet on the surface, stop, turn sharply, resume swimming, then return to your starting place.' },
    { id: '5c', text: 'Demonstrate water rescue methods by reaching with your arm or leg, by reaching with a suitable object, and by throwing lines and objects.' },
    { id: '5d', text: 'Explain why swimming rescues should not be attempted when a reaching or throwing rescue is possible. Explain why and how a rescue swimmer should avoid contact with the victim.' },
    { id: '6a', text: 'Demonstrate first aid for the following: Object in the eye; Bite of a warm-blooded animal; Puncture wounds from a splinter, nail, and fishhook; Serious burns (partial thickness, or second-degree); Heat exhaustion; Shock; Heatstroke, dehydration, hypothermia, and hyperventilation.' },
    { id: '6b', text: 'Show what to do for "hurry" cases of stopped breathing, stroke, severe bleeding, and ingested poisoning.' },
    { id: '6c', text: 'Tell what you can do while on a campout or hike to prevent or reduce the occurrence of the injuries listed in Second Class requirements 6a and 6b.' },
    { id: '6d', text: 'Explain what to do in case of accidents that require emergency response in the home and backcountry. Explain what constitutes an emergency and what information you will need to provide to a responder.' },
    { id: '6e', text: 'Tell how you should respond if you come upon the scene of a vehicular accident.' },
    { id: '7a', text: 'After completing Tenderfoot requirement 6c, be physically active at least 30 minutes each day for five days a week for four weeks. Keep track of your activities.' },
    { id: '7b', text: 'Share your challenges and successes in completing Second Class requirement 7a. Set a goal for continuing to include physical activity as part of your daily life and develop a plan for doing so.' },
    { id: '7c', text: 'Participate in a school, community, or troop program on the dangers of using drugs, alcohol, and tobacco and other practices that could be harmful to your health. Discuss your participation in the program with your family, and explain the dangers of substance addictions. Report to your Scoutmaster or other adult leader in your troop about which parts of the Scout Oath and Scout Law relate to what you learned.' },
    { id: '8a', text: 'Participate in a flag ceremony for your school, religious institution, chartered organization, community, or Scouting activity.' },
    { id: '8b', text: 'Explain what respect is due the flag of the United States.' },
    { id: '8c', text: 'With your parents or guardian, decide on an amount of money that you would like to earn, based on the cost of a specific item you would like to purchase. Develop a written plan to earn the amount agreed upon and follow that plan; it is acceptable to make changes to your plan along the way. Discuss any changes made to your original plan and whether you met your goal.' },
    { id: '8d', text: 'At a minimum of three locations, compare the cost of the item for which you are saving to determine the best place to purchase it. After completing Second Class requirement 8c, decide if you will use the amount that you earned as originally intended, save all or part of it, or use it for another purpose.' },
    { id: '8e', text: 'Participate in two hours of service through one or more service projects approved by your Scoutmaster. Tell how your service to others relates to the Scout Oath.' },
    { id: '9a', text: "Explain the three R's of personal safety and protection." },
    { id: '9b', text: 'Describe bullying; tell what the appropriate response is to someone who is bullying you or another person.' },
    { id: '10', text: 'Demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God and how you have lived four different points of the Scout Law (not to include those used for Tenderfoot requirement 9) in your everyday life.' },
    { id: '11', text: 'While working toward the Second Class rank, and after completing Tenderfoot requirement 10, participate in a Scoutmaster conference.' },
    { id: '12', text: 'Successfully complete your board of review for the Second Class rank.' },
  ],
  'First Class': [
    { id: '1a', text: 'Since joining Boy Scouts, participate in 10 separate troop/patrol activities, at least six of which must be held outdoors. Of the outdoor activities, at least three must include overnight camping. These activities do not include troop or patrol meetings. On campouts, spend the night in a tent that you pitch or other structure that you help erect, such as a lean-to, snow cave, or tepee.' },
    { id: '1b', text: 'Explain each of the principles of Tread Lightly! and tell how you practiced them on a campout or outing. This outing must be different from the ones used for Tenderfoot requirement 1c and Second Class requirement 1b.' },
    { id: '2a', text: 'Help plan a menu for one of the above campouts that includes at least one breakfast, one lunch, and one dinner, and that requires cooking at least two of the meals. Tell how the menu includes the foods from MyPlate or the current USDA nutritional model and how it meets nutritional needs for the planned activity or campout.' },
    { id: '2b', text: 'Using the menu planned in First Class requirement 2a, make a list showing a budget and the food amounts needed to feed three or more boys. Secure the ingredients.' },
    { id: '2c', text: 'Show which pans, utensils, and other gear will be needed to cook and serve these meals.' },
    { id: '2d', text: 'Demonstrate the procedures to follow in the safe handling and storage of fresh meats, dairy products, eggs, vegetables, and other perishable food products. Show how to properly dispose of camp garbage, cans, plastic containers, and other rubbish.' },
    { id: '2e', text: 'On one campout, serve as cook. Supervise your assistant(s) in using a stove or building a cooking fire. Prepare the breakfast, lunch, and dinner planned in First Class requirement 2a. Supervise the cleanup.' },
    { id: '3a', text: 'Discuss when you should and should not use lashings.' },
    { id: '3b', text: 'Demonstrate tying the timber hitch and clove hitch.' },
    { id: '3c', text: 'Demonstrate tying the square, shear, and diagonal lashings by joining two or more poles or staves together.' },
    { id: '3d', text: 'Use lashings to make a useful camp gadget or structure.' },
    { id: '4a', text: 'Using a map and compass, complete an orienteering course that covers at least one mile and requires measuring the height and/or width of designated items (tree, tower, canyon, ditch, etc.).' },
    { id: '4b', text: 'Demonstrate how to use a handheld GPS unit, GPS app on a smartphone, or other electronic navigation system. Use GPS to find your current location, a destination of your choice, and the route you will take to get there. Follow that route to arrive at your destination.' },
    { id: '5a', text: 'Identify or show evidence of at least 10 kinds of native plants found in your local area or campsite location. You may show evidence by identifying fallen leaves or fallen fruit that you find in the field, or as part of a collection you have made, or by photographs you have taken.' },
    { id: '5b', text: 'Identify two ways to obtain a weather forecast for an upcoming activity. Explain why weather forecasts are important when planning for an event.' },
    { id: '5c', text: 'Describe at least three natural indicators of impending hazardous weather, the potential dangerous events that might result from such weather conditions, and the appropriate actions to take.' },
    { id: '5d', text: 'Describe extreme weather conditions you might encounter in the outdoors in your local geographic area. Discuss how you would determine ahead of time the potential risk of these types of weather dangers, alternative planning considerations to avoid such risks, and how you would prepare for and respond to those weather conditions.' },
    { id: '6a', text: 'Successfully complete the BSA swimmer test.' },
    { id: '6b', text: 'Tell what precautions must be taken for a safe trip afloat.' },
    { id: '6c', text: 'Identify the basic parts of a canoe, kayak, or other boat. Identify the parts of a paddle or an oar.' },
    { id: '6d', text: 'Describe proper body positioning in a watercraft, depending on the type and size of the vessel. Explain the importance of proper body position in the boat.' },
    { id: '6e', text: 'With a helper and a practice victim, show a line rescue both as tender and as rescuer. (The practice victim should be approximately 30 feet from shore in deep water).' },
    { id: '7a', text: 'Demonstrate bandages for a sprained ankle and for injuries on the head, the upper arm, and the collarbone.' },
    { id: '7b', text: 'By yourself and with a partner, show how to: Transport a person from a smoke-filled room. Transport for at least 25 yards a person with a sprained ankle.' },
    { id: '7c', text: 'Tell the five most common signals of a heart attack. Explain the steps (procedures) in cardiopulmonary resuscitation (CPR).' },
    { id: '7d', text: 'Tell what utility services exist in your home or meeting place. Describe potential hazards associated with these utilities and tell how to respond in emergency situations.' },
    { id: '7e', text: 'Develop an emergency action plan for your home that includes what to do in case of fire, storm, power outage, and water outage.' },
    { id: '7f', text: 'Explain how to obtain potable water in an emergency.' },
    { id: '8a', text: 'After completing Second Class requirement 7a, be physically active at least 30 minutes each day for five days a week for four weeks. Keep track of your activities.' },
    { id: '8b', text: 'Share your challenges and successes in completing First Class requirement 8a. Set a goal for continuing to include physical fitness as part of your daily life.' },
    { id: '9a', text: 'Visit and discuss with a selected individual approved by your leader (for example, an elected official, judge, attorney, civil servant, principal, or teacher) the constitutional rights and obligations of a U.S. citizen.' },
    { id: '9b', text: 'Investigate an environmental issue affecting your community. Share what you learned about that issue with your patrol or troop. Tell what, if anything, could be done by you or your community to address the concern.' },
    { id: '9c', text: 'On a Scouting or family outing, take note of the trash and garbage you produce. Before your next similar outing, decide how you can reduce, recycle, or repurpose what you take on that outing, and then put those plans into action. Compare your results.' },
    { id: '9d', text: 'Participate in three hours of service through one or more service projects approved by your Scoutmaster. The project(s) must not be the same service project(s) used for Tenderfoot requirement 7b and Second Class requirement 8e. Explain how your service to others relates to the Scout Law.' },
    { id: '10', text: 'Tell someone who is eligible to join Boy Scouts, or an inactive Boy Scout, about your Scouting activities. Invite him to an outing, activity, service project, or meeting. Tell him how to join, or encourage the inactive Boy Scout to become active. Share your efforts with your Scoutmaster or other adult leader.' },
    { id: '11', text: 'Demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God and how you have lived four different points of the Scout Law (different from those points used for previous ranks) in your everyday life.' },
    { id: '12', text: 'While working toward the First Class rank, and after completing Second Class requirement 11, participate in a Scoutmaster conference.' },
    { id: '13', text: 'Successfully complete your board of review for the First Class rank.' },
  ],
  Star: [
    { id: '1', text: 'Be active in your troop for at least four months as a First Class Scout.' },
    { id: '2', text: 'As a First Class Scout, demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God and how you have lived the Scout Oath and Scout Law in your everyday life.' },
    { id: '3', text: 'Earn six merit badges, including any four from the required list for Eagle. You may choose any of the 17 merit badges on the required list for Eagle to fulfill this requirement. See Eagle rank requirement 3 for this list.' },
    { id: '4', text: 'While a First Class Scout, participate in six hours of service through one or more service projects approved by your Scoutmaster.' },
    { id: '5', text: 'While a First Class Scout, serve actively in your troop for four months in one or more of the following positions of responsibility (or carry out a Scoutmaster-approved leadership project to help the troop): Patrol leader, assistant senior patrol leader, senior patrol leader, troop guide, Order of the Arrow troop representative, den chief, scribe, librarian, historian, quartermaster, bugler, junior assistant Scoutmaster, chaplain aide, instructor, webmaster, or outdoor ethics guide.' },
    { id: '6', text: "With your parent or guardian, complete the exercises in the pamphlet How to Protect Your Children From Child Abuse: A Parent's Guide and earn the Cyber Chip award for your grade." },
    { id: '7', text: 'While a First Class Scout, participate in a Scoutmaster conference.' },
    { id: '8', text: 'Successfully complete your board of review for the Star rank.' },
  ],
  Life: [
    { id: '1', text: 'Be active in your troop for at least six months as a Star Scout.' },
    { id: '2', text: 'As a Star Scout, demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God and how you have lived the Scout Oath and Scout Law in your everyday life.' },
    { id: '3', text: 'Earn five more merit badges (so that you have 11 in all), including any three additional badges from the required list for Eagle. You may choose any of the 17 merit badges on the required list for Eagle to fulfill this requirement. See Eagle rank requirement 3 for this list.' },
    { id: '4', text: 'While a Star Scout, participate in six hours of service through one or more service projects approved by your Scoutmaster. At least three hours of this service must be conservation-related.' },
    { id: '5', text: 'While a Star Scout, serve actively in your troop for six months in one or more of the following troop positions of responsibility (or carry out a Scoutmaster-approved leadership project to help the troop): Patrol leader, assistant senior patrol leader, senior patrol leader, troop guide, Order of the Arrow troop representative, den chief, scribe, librarian, historian, quartermaster, bugler, junior assistant Scoutmaster, chaplain aide, instructor, webmaster, or outdoor ethics guide.' },
    { id: '6', text: "While a Star Scout, use the Teaching EDGE method to teach another Scout (preferably younger than you) the skills from ONE of the following choices, so that the Scout is prepared to pass those requirements to their Scoutmaster's satisfaction: (a) Tenderfoot 4a and 4b, (b) Second Class 2b, 2c, and 2d, (c) Second Class 3a and 3d, (d) First Class 3a, 3b, 3c, and 3d, (e) First Class 4a and 4b, (f) Second Class 6a and 6b, (g) First Class 7a and 7b, (h) Three requirements from one of the required Eagle merit badges, as approved by your Scoutmaster." },
    { id: '7', text: 'While a Star Scout, participate in a Scoutmaster conference.' },
    { id: '8', text: 'Successfully complete your board of review for the Life rank.' },
  ],
  Eagle: [
    { id: '1', text: 'Be active in your troop for at least six months as a Life Scout.' },
    { id: '2', text: "As a Life Scout, demonstrate Scout Spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God, how you have lived the Scout Oath and Scout Law in your everyday life, and how your understanding of the Scout Oath and Scout Law will guide your life in the future. List on your Eagle Scout Rank Application the names of individuals who know you personally and would be willing to provide a recommendation on your behalf, including parents/guardians, religious (if not affiliated with an organized religion, then the parent or guardian provides this reference), educational, employer (if employed), and two other references." },
    { id: '3', text: 'Earn a total of 21 merit badges (10 more than required for the Life rank), including these 13 merit badges: (a) First Aid, (b) Citizenship in the Community, (c) Citizenship in the Nation, (d) Citizenship in the World, (e) Communication, (f) Cooking, (g) Personal Fitness, (h) Emergency Preparedness OR Lifesaving, (i) Environmental Science OR Sustainability, (j) Personal Management, (k) Swimming OR Hiking OR Cycling, (l) Camping, and (m) Family Life.' },
    { id: '4', text: 'While a Life Scout, serve actively in your troop for six months in one or more of the following positions of responsibility: Patrol leader, assistant senior patrol leader, senior patrol leader, troop guide, Order of the Arrow troop representative, den chief, scribe, librarian, historian, quartermaster, junior assistant Scoutmaster, chaplain aide, instructor, webmaster, or outdoor ethics guide.' },
    { id: '5', text: 'While a Life Scout, plan, develop, and give leadership to others in a service project helpful to any religious institution, any school, or your community. (The project must benefit an organization other than the Boy Scouts of America.) A project proposal must be approved by the organization benefiting from the effort, your Scoutmaster and unit committee, and the council or district before you start. You must use the Eagle Scout Service Project Workbook, BSA publication No. 512-927, in meeting this requirement.' },
    { id: '6', text: 'While a Life Scout, participate in a Scoutmaster conference.' },
    { id: '7', text: 'Successfully complete your board of review for the Eagle Scout rank.' },
  ],
}

function daysLeft(startDateStr, months) {
  if (!startDateStr) return null
  const start = new Date(startDateStr)
  const end = new Date(start)
  end.setMonth(end.getMonth() + months)
  const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

function RankTracker() {
  const [currentRank, setCurrentRank] = useState(() => localStorage.getItem('sp_rank') || null)
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_completed') || '{}') } catch { return {} }
  })
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_notes') || '{}') } catch { return {} }
  })
  const [startDates, setStartDates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_startdates') || '{}') } catch { return {} }
  })
  const [filterIncomplete, setFilterIncomplete] = useState(false)
  const [openNote, setOpenNote] = useState(null)
  const [collapsedRanks, setCollapsedRanks] = useState({})
  const [dismissedCelebration, setDismissedCelebration] = useState(false)

  useEffect(() => { localStorage.setItem('sp_rank', currentRank || '') }, [currentRank])
  useEffect(() => { localStorage.setItem('sp_completed', JSON.stringify(completed)) }, [completed])
  useEffect(() => { localStorage.setItem('sp_notes', JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem('sp_startdates', JSON.stringify(startDates)) }, [startDates])

  const rankIndex = ranks.indexOf(currentRank)
  const currentReqs = currentRank ? requirements[currentRank] : []
  const completedCount = currentReqs.filter(r => completed[r.id + currentRank]).length
  const allDone = currentReqs.length > 0 && completedCount === currentReqs.length
  const rankProgress = currentRank ? (rankIndex / (ranks.length - 1)) * 100 : 0
  const reqProgress = currentReqs.length > 0 ? (completedCount / currentReqs.length) * (100 / (ranks.length - 1)) : 0
  const totalProgress = Math.min(100, Math.round(rankProgress + reqProgress))
  const upcomingRanks = currentRank ? ranks.slice(rankIndex + 1) : []

  const toggleReq = (rank, id) => {
    const timeKey = rank + id
    const timeReq = timeRequirements[timeKey]
    if (timeReq) {
      const days = daysLeft(startDates[timeKey], timeReq.months)
      if (days === null || days > 0) return
    }
    const key = id + rank
    setCompleted(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleNoteChange = (rank, id, value) => {
    setNotes(prev => ({ ...prev, [id + rank]: value }))
  }

  const handleStartDate = (rank, id, value) => {
    setStartDates(prev => ({ ...prev, [rank + id]: value }))
  }

  const renderRequirement = (req, rank, dimmed = false) => {
    const key = req.id + rank
    const done = !!completed[key]
    const timeKey = rank + req.id
    const timeReq = timeRequirements[timeKey]
    const days = timeReq ? daysLeft(startDates[timeKey], timeReq.months) : null
    const timeLocked = timeReq && (days === null || days > 0)
    const noteOpen = openNote === key

    if (filterIncomplete && done) return null

    return (
      <div key={key} style={{ marginBottom: '8px', opacity: dimmed ? 0.65 : 1 }}>
        <div
          onClick={() => !timeLocked && toggleReq(rank, req.id)}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            padding: '14px 16px',
            backgroundColor: done ? '#eafaf1' : timeLocked ? '#fafafa' : 'white',
            borderRadius: noteOpen ? '12px 12px 0 0' : '12px',
            cursor: timeLocked ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: done ? '1.5px solid #2ecc71' : timeLocked ? '1.5px solid #f0c080' : '1.5px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            minWidth: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: done ? '#2ecc71' : timeLocked ? '#f0c080' : '#ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '1px'
          }}>
            {done
              ? <span style={{ color: 'white', fontSize: '13px' }}>✓</span>
              : timeLocked
              ? <span style={{ fontSize: '13px' }}>⏳</span>
              : <span style={{ color: '#999', fontSize: '11px', fontWeight: '700' }}>{req.id}</span>
            }
          </div>

          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: done ? '#999' : '#2c3e50',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              marginBottom: '3px'
            }}>
              Req {req.id}
            </span>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              textDecoration: done ? 'line-through' : 'none',
              color: done ? '#999' : '#2c3e50',
              margin: 0
            }}>
              {req.text}
            </p>

            {timeLocked && (
              <p style={{ fontSize: '12px', color: '#e67e22', fontWeight: '700', margin: '6px 0 0' }}>
                Set a start date below — you can't check this off until the time requirement is met.
              </p>
            )}

            {timeReq && (
              <div style={{ marginTop: '10px' }} onClick={e => e.stopPropagation()}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Start date — {timeReq.label}:
                </label>
                <input
                  type="date"
                  value={startDates[timeKey] || ''}
                  onChange={e => handleStartDate(rank, req.id, e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #ddd',
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: '13px'
                  }}
                />
                {days !== null && (
                  <span style={{
                    marginLeft: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: days <= 0 ? '#2ecc71' : days <= 30 ? '#e67e22' : '#3498db'
                  }}>
                    {days <= 0 ? '✓ Time requirement met' : `${days} days remaining`}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={e => { e.stopPropagation(); setOpenNote(noteOpen ? null : key) }}
            title="Add note"
            style={{
              background: noteOpen ? '#e8f4fd' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '4px 8px',
              borderRadius: '8px',
              flexShrink: 0,
              color: notes[key] ? '#3498db' : '#bbb'
            }}
          >
            📝
          </button>
        </div>

        {noteOpen && (
          <div style={{
            backgroundColor: '#f8fbff',
            border: '1.5px solid #d0e8f8',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            padding: '12px 16px'
          }}>
            <textarea
              value={notes[key] || ''}
              onChange={e => handleNoteChange(rank, req.id, e.target.value)}
              placeholder="Add a note — when you did this, who signed off, what you still need..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px',
                borderRadius: '8px',
                border: '1.5px solid #ddd',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '13px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '30px 20px', maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Rank Tracker</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>Select the rank you are currently working toward</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
        {ranks.map(rank => (
          <button
            key={rank}
            onClick={() => { setCurrentRank(rank); setDismissedCelebration(false) }}
            style={{
              padding: '10px 20px',
              backgroundColor: currentRank === rank ? '#2c3e50' : 'white',
              color: currentRank === rank ? 'white' : '#2c3e50',
              border: '2px solid #2c3e50',
              borderRadius: '30px',
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            {rank}
          </button>
        ))}
      </div>

      {currentRank && (
        <>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '700' }}>Overall Eagle Progress</span>
              <span style={{ fontWeight: '700', color: '#2ecc71' }}>{totalProgress}%</span>
            </div>
            <div style={{ backgroundColor: '#ddd', borderRadius: '10px', height: '14px' }}>
              <div style={{
                width: `${totalProgress}%`,
                backgroundColor: '#2ecc71',
                height: '14px',
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
              {currentRank} requirements: <strong>{completedCount}/{currentReqs.length}</strong> completed
            </p>
          </div>

          {allDone && !dismissedCelebration && (
            <div style={{
              backgroundColor: '#2ecc71',
              color: 'white',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>
                  🎉 {currentRank} complete!
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  {currentRank === 'Eagle'
                    ? 'Congratulations, Eagle Scout!'
                    : `Time to start working toward ${ranks[rankIndex + 1]}.`}
                </div>
              </div>
              <button
                onClick={() => setDismissedCelebration(true)}
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: '800', fontSize: '20px', margin: 0 }}>
              {currentRank} Requirements
            </h2>
            <button
              onClick={() => setFilterIncomplete(f => !f)}
              style={{
                padding: '8px 16px',
                backgroundColor: filterIncomplete ? '#2c3e50' : 'white',
                color: filterIncomplete ? 'white' : '#2c3e50',
                border: '2px solid #2c3e50',
                borderRadius: '20px',
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '700',
                fontSize: '13px'
              }}
            >
              {filterIncomplete ? 'Show all' : 'Incomplete only'}
            </button>
          </div>

          {currentReqs.map(req => renderRequirement(req, currentRank))}

          {upcomingRanks.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h2 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '6px', color: '#2c3e50' }}>
                Upcoming Ranks
              </h2>
              <p style={{ color: '#999', fontSize: '13px', marginBottom: '16px' }}>
                Preview requirements for future ranks and start checking things off early.
              </p>
              {upcomingRanks.map(rank => {
                const reqs = requirements[rank]
                const doneCount = reqs.filter(r => completed[r.id + rank]).length
                const isCollapsed = collapsedRanks[rank] !== false
                return (
                  <div key={rank} style={{ marginBottom: '16px' }}>
                    <button
                      onClick={() => setCollapsedRanks(prev => ({ ...prev, [rank]: !isCollapsed }))}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 16px',
                        backgroundColor: 'white',
                        border: '1.5px solid #ddd',
                        borderRadius: isCollapsed ? '12px' : '12px 12px 0 0',
                        cursor: 'pointer',
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: '700',
                        fontSize: '15px',
                        color: '#2c3e50'
                      }}
                    >
                      <span>{rank}</span>
                      <span style={{ fontSize: '13px', color: doneCount > 0 ? '#3498db' : '#999' }}>
                        {doneCount}/{reqs.length} {isCollapsed ? '▼' : '▲'}
                      </span>
                    </button>
                    {!isCollapsed && (
                      <div style={{
                        border: '1.5px solid #ddd',
                        borderTop: 'none',
                        borderRadius: '0 0 12px 12px',
                        padding: '16px'
                      }}>
                        {reqs.map(req => renderRequirement(req, rank, true))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default RankTracker