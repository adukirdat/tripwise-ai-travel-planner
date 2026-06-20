const phaseOneMessage = (action) =>
  `${action} endpoint is prepared. Plan business logic will be implemented in the next phase.`;

export const getPlans = async (_req, res) => {
  return res.status(501).json({ message: phaseOneMessage("Get plans") });
};

export const createPlan = async (_req, res) => {
  return res.status(501).json({ message: phaseOneMessage("Create plan") });
};

export const purchasePlan = async (_req, res) => {
  return res.status(501).json({ message: phaseOneMessage("Purchase plan") });
};
