-- Rewrites every service description to a consistent ~17-word length so
-- each "What We Offer" tile reads as roughly the same size, matching a
-- reference layout the business asked to match (bigger title, short
-- normalized description, left accent rule before the text).

update services set description = 'Clean, engaging stand-up comedy that keeps any crowd smiling at weddings, birthdays, and corporate celebrations all night.' where title = 'Stand-up Comedy';
update services set description = 'Confident, professional hosting that keeps your audience engaged while the programme flows smoothly from start to finish.' where title = 'Event Hosting';
update services set description = 'High energy crowd work that keeps the room buzzing all night, the perfect complement to your MC.' where title = 'Hype Man';
update services set description = 'A special guest appearance that adds excitement to openings, launches, or private functions your guests will remember.' where title = 'Appearance (Cameo)';
update services set description = 'A recurring comedy night full of laughter, live performances, and vibes, connecting fans with Uncle Ses directly.' where title = 'JustKidding with Uncle Ses';
update services set description = 'Vibrant, high quality photography that preserves genuine moments from weddings, birthdays, corporate events for years to come.' where title = 'Photography';
update services set description = 'Professional video coverage and content creation that captures every moment, ready to share across social media platforms.' where title = 'Video Coverage & Content Creation';
update services set description = 'Engaging promotional campaigns and branded content that build visibility, credibility, and trust for your growing business today.' where title = 'Brand Promotion & Adverts';
update services set description = 'Well organized, beautifully coordinated event planning from concept to execution, with every detail carefully handled for you.' where title = 'Event Planning';
