import { getModelById, getModels } from '../services/modelService';

describe('Model Service', () => {
  it('should fetch all models', async () => {
    const models = await getModels();
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);
  });

  it('should fetch a model by ID', async () => {
    const models = await getModels();
    const firstModelId = models[0].id;
    
    const model = await getModelById(firstModelId);
    expect(model).toBeDefined();
    expect(model?.id).toBe(firstModelId);
  });

  it('should return undefined for non-existent model ID', async () => {
    const model = await getModelById('non-existent-id');
    expect(model).toBeUndefined();
  });
});
