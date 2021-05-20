<?php

namespace WebApps\Apps\StaffDirectory\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use WebApps\Apps\StaffDirectory\Models\Department;

class DepartmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Department::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->company(),
            'head_id' => $this->faker->numberBetween(1, 200),
            'department_id' => ($this->faker->boolean(5)) ? $this->faker->numberBetween(1, 10) : null
        ];
    }
}
