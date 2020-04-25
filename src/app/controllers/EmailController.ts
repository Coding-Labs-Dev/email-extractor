import { Request, Response } from 'express';
import { Email, Contact, Template } from '@models/index';
import { Op } from 'sequelize';
import QueueService from '@services/QueueService';

class EmailController {
  async index(_req: Request, res: Response): Promise<Response> {
    return res.json(
      await Email.findAll({
        include: [
          {
            model: Template,
            as: 'template',
          },
        ],
      }),
    );
  }

  async store(req: Request, res: Response): Promise<Response> {
    const { name, templateId, variables, subject, contacts } = req.body;
    const email = await Email.create({
      name,
      subject,
      templateId,
      variables,
    });
    const activeContacts = await Contact.findAll({
      where: {
        [Op.or]: { id: contacts },
        [Op.and]: { active: true },
      },
    });

    await email.setContacts(activeContacts.map(({ id }) => id));

    const queueService = new QueueService();

    const queue = await queueService.run(email, activeContacts);

    return res.json({ email, queue });
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const email = await Email.findByPk(id, {
      rejectOnEmpty: true,
      include: [
        { model: Template, as: 'template' },
        { model: Contact, as: 'contacts' },
      ],
    });
    return res.json(email);
  }
}

export default new EmailController();
