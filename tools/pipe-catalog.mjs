// Nominal OD/wall in inches, from the manufacturer chart linked in references/design-basis.md.
// Use OD - 2*wall, not copied ID cells (the source has several typographical errors).
// Sch 40/80 are not Sch 40S/80S. Missing schedule combinations remain unavailable.
const rows = [
  [6,'1/8',.405,.068,.095], [8,'1/4',.540,.088,.119], [10,'3/8',.675,.091,.126],
  [15,'1/2',.840,.109,.147], [20,'3/4',1.050,.113,.154], [25,'1',1.315,.133,.179],
  [32,'1 1/4',1.660,.140,.191], [40,'1 1/2',1.900,.145,.200], [50,'2',2.375,.154,.218],
  [65,'2 1/2',2.875,.203,.276], [80,'3',3.500,.216,.300], [90,'3 1/2',4.000,.226,.318],
  [100,'4',4.500,.237,.337], [125,'5',5.563,.258,.375], [150,'6',6.625,.280,.432],
  [200,'8',8.625,.322,.500], [250,'10',10.750,.365,.594], [300,'12',12.750,.406,.688],
  [350,'14',14,.438,.750], [400,'16',16,.500,.844], [450,'18',18,.562,.938],
  [500,'20',20,.594,1.031], [550,'22',22,null,1.125], [600,'24',24,.688,1.219],
];
export const PIPE_CATALOG = rows.flatMap(([dn,nps,od,t40,t80]) =>
  [['40',t40],['80',t80]].filter(([,wall])=>wall!==null).map(([schedule,wall])=>({
    dn,nps,schedule,odMm:od*25.4,wallMm:wall*25.4,
    idMm:Math.round((od-2*wall)*25.4*10)/10,
    source:'Penn Stainless nominal OD/wall; ID rounded to 0.1 mm',
  })));
